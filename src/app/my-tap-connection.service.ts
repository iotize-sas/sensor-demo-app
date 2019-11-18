import { Injectable } from "@angular/core";
import { concat, tap, share } from "rxjs/operators";
import {
  ProtocolMeta,
  TapConnectionService,
  TagDiscoveredEvent,
  NfcService,
  tagEventToProtocolMetaNFC,
  CurrentDeviceService,
  TapConnectionOptions
} from "@iotize/ionic";
import { of, Observable } from "rxjs";
import { ToastService, AppNavigationService, LoaderService } from "app-theme";
import getDebugger from "src/app/logger";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
const debug = getDebugger("MyTapConnectionService");

@Injectable({
  providedIn: "root"
})
export class MyTapConnectionService {
  _nfcEvent: TagDiscoveredEvent;

  private deviceHomeUrl = "/device";

  constructor(
    public tapConnectionService: TapConnectionService,
    public toastService: ToastService,
    public tapService: CurrentDeviceService,
    public appNav: AppNavigationService,
    public loaderService: LoaderService,
    public router: Router,
    public nfcService: NfcService
  ) {}

  async listenToNfcTaps(): Promise<void> {
    debug("listenToNfcTaps");
    await this.nfcService.setupNdefListener();
    debug("setupNdefListener OK");
    await this.nfcService.setupMimeTypeListener(environment.nfcMimeType);
    debug("setupMimeTypeListener OK");
    this.nfcService.listen().subscribe((event: TagDiscoveredEvent) => {
      this.onNfcDiscoveredEvent(event);
    });
  }

  connectWithLoader(
    meta: ProtocolMeta,
    options: TapConnectionOptions = {
      switchProtocol: true,
      refreshSessionState: true
    }
  ): Observable<any> {
    let obs = this.tapConnectionService.connect(meta, options).pipe(
      concat(of("Loading application...")),
      concat(this.appNav.waitForNavigationEnd(this.deviceHomeUrl, 10000)),
      tap({
        error: (err: Error) => {
          debug("Error while loading", err);
          this.toastService.error(err);
        }
      }),
      share()
    );
    this.loaderService
      .addTask({
        message: `Loading device (${meta.type})...`,
        stream: obs
      })
      .catch(err => {
        debug("Loading error", err);
        this.toastService.error(err);
      });
    return obs;
  }

  async onNfcDiscoveredEvent(event: TagDiscoveredEvent) {
    if (!event.tag) {
      debug("Ignoring NFC event", event);
      return;
    }
    if (this._nfcEvent) {
      debug("Already loading event");
      return;
    }
    this._nfcEvent = event;
    try {
      if (this.tapService.hasTap) {
        let currentProtocolMeta = this.tapService.protocolMeta;
        let isSameTag = await this.tapService.isSameTag(event);
        if (isSameTag) {
          debug("Same NFC tag");
          if (currentProtocolMeta.type === "nfc") {
            await this.tapService.disconnect().catch(err => {}); // Ignore disconnection error
            await this.tapService.connect();
          } else {
            debug(`Taping the same device, we switch to NFC `);
            let meta = tagEventToProtocolMetaNFC(event);
            await this.tapService.useProtocolFromMeta(meta);
          }
          if (!this.router.url.startsWith(this.deviceHomeUrl)) {
            await this.appNav
              .waitForNavigationEnd(this.deviceHomeUrl, 10000)
              .toPromise();
          }
        } else {
          debug("Different NFC tag");
          await this.tapService.remove();
          await this.connectWithLoader(tagEventToProtocolMetaNFC(event), {
            switchProtocol: true
          }).toPromise();
        }
      } else {
        debug("New NFC event", event);
        await this.connectWithLoader(tagEventToProtocolMetaNFC(event), {
          switchProtocol: true
        }).toPromise();
      }
      if (this.tapService.protocolMeta.type != "nfc") {
        await this.toastService.success({
          message: `You are now connected with ${this.tapService.protocolMeta.type}`
        });
      }
    } catch (err) {
      console.warn("Tap connection service error: ", err);
      this.toastService
        .error({
          message: err.message || `Unknown error while connecting to tap`
        })
        .catch((err: Error) => {
          console.warn(err);
        });
    }
    this._nfcEvent = undefined;
  }
}
