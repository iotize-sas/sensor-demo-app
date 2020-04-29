import { Injectable, Inject } from "@angular/core";
import { concat, tap, share } from "rxjs/operators";
import {
  ProtocolMeta,
  TapConnectionService,
  TagDiscoveredEvent,
  NfcService,
  tagToProtocolMetaNFC,
  RecoverableTapStateEvent,
  CurrentDeviceService,
  TapConnectionOptions
} from "@iotize/ionic";
import { of, Observable } from "rxjs";
import { Platform } from "@ionic/angular";
import { ToastService, AppNavigationService, LoaderService } from "app-theme";
import getDebugger from "src/app/logger";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { EncryptionKeys } from "@iotize/device-client.js";
import { hexStringToBuffer } from "@iotize/common/byte-converter";

import { NdefTag } from "@iotize/device-com-nfc.cordova";

const debug = getDebugger("MyTapConnectionService");

@Injectable({
  providedIn: "root"
})
export class MyTapConnectionService {
  _ndefTag: NdefTag;

  private deviceHomeUrl = "/device";

  constructor(
    public tapConnectionService: TapConnectionService,
    public toastService: ToastService,
    public tapService: CurrentDeviceService,
    public appNav: AppNavigationService,
    public loaderService: LoaderService,
    public platform: Platform,
    @Inject("TapConnectionOptions") public connectOptions: TapConnectionOptions,
    public router: Router,
    public nfcService: NfcService
  ) {}

  connectWithLoader(
    meta: ProtocolMeta,
    options: TapConnectionOptions = this.connectOptions
  ): Observable<any> {
    debug("connectWithLoader ", meta, options);
    let obs = this.tapConnectionService
      .connect(meta as any, options)
      .pipe(
        concat(of("Loading application...")),
        concat(this.appNav.waitForNavigationEnd(this.deviceHomeUrl, 10000)),
        share()
      );
    this.loaderService
      .addTask({
        message: `Loading device (${meta.type})...`,
        stream: obs
      })
      .catch(err => {
        console.error("Loading error", err);
        if (err.message) {
          this.toastService.error({
            message: err.message
          });
        }
      });
    return obs;
  }

  async listenToNfcTaps(): Promise<void> {
    // Android nfc plugin is able to enable and perform NFC pairing
    // This is faster as NFC pairing is done directly in the native part
    // However it does not work well with energy harvesting
    if (this.platform.is("android")) {
      this.nfcService.tapDevices().subscribe(event => {
        if (!event.tag || !event.tap) {
          debug("Skip invalid Tap event. ", event);
          return;
        }
        debug(`Tap event: `, event);
        this.onTapDeviceDiscovered(event);
      });
      await this.nfcService.setupTapDeviceListener();
      debug("setupTapDeviceListener OK");
    } else {
      this.nfcService.events().subscribe((event: TagDiscoveredEvent) => {
        this.onNfcDiscoveredEvent(event.tag);
      });
      await this.nfcService.setupNdefListener();
      debug("setupNdefListener OK");
      await this.nfcService.setupMimeTypeListener(environment.nfcMimeType);
      debug("setupMimeTypeListener OK");
    }
  }

  async onNfcTapDiscoveredEvent(event: any) {
    if (!event.tag) {
      debug("Ignoring NFC event, no nfc tag given", event);
      return;
    }
    if (!event.tap) {
      debug("Ignoring tap event, no Tap given", event);
      return;
    }

    let protocolMeta = tagToProtocolMetaNFC(event.tagDiscovered);

    await this.connectWithLoader(protocolMeta, {
      switchProtocol: true
    }).toPromise();
  }

  async connectWithNfcTag(
    tag: NdefTag,
    connectOptions: TapConnectionOptions = this.connectOptions
  ) {
    if (this._ndefTag) {
      debug("Already loading event");
      throw new Error("Please wait, already loading Tap from NFC");
    }
    try {
      this._ndefTag = tag;
      let nfcProtocolMeta = tagToProtocolMetaNFC(tag);
      if (this.tapService.hasTap) {
        let currentProtocolMeta = this.tapService.protocolMeta;
        let isSameTag = await this.tapService.isSameTag(tag);
        if (isSameTag) {
          debug("Same NFC tag");
          if (currentProtocolMeta.type === "nfc") {
            await this.tapService.disconnect().catch(err => {}); // Ignore disconnection error
            await this.tapService.connect();
          } else {
            debug(`Taping the same device, we switch to NFC `);
            await this.tapService.useProtocolFromMeta(nfcProtocolMeta);
          }
          if (!this.router.url.startsWith(this.deviceHomeUrl)) {
            await this.appNav
              .waitForNavigationEnd(this.deviceHomeUrl, 10000)
              .toPromise();
          }
        } else {
          debug("Different NFC tag");
          await this.connectWithLoader(
            nfcProtocolMeta,
            connectOptions
          ).toPromise();
        }
      } else {
        debug("New NFC event", tag);
        await this.connectWithLoader(
          nfcProtocolMeta,
          connectOptions
        ).toPromise();
      }
      this._ndefTag = undefined;
    } catch (err) {
      this._ndefTag = undefined;
      throw err;
    }
  }

  async onNfcDiscoveredEvent(
    tag: NdefTag,
    connectOptions: TapConnectionOptions = this.connectOptions
  ) {
    try {
      await this.connectWithNfcTag(tag, connectOptions);
    } catch (err) {
      debug("Tap connection service error: ", err);
    }
  }

  private async onTapDeviceDiscovered(event: RecoverableTapStateEvent) {
    debug("onTapDeviceDiscovered", event);
    let tapState = event.tap;

    let connectionOptions: TapConnectionOptions = {
      encryption: {
        enabled: tapState.encryption ? tapState.encryption.enabled : undefined,
        keys: parseKeys(
          tapState.encryption ? tapState.encryption.keys : undefined
        ),
        frameCounter: tapState.encryption.frameCounter
      },
      nfcPairing: !tapState.nfcPairingDone && this.connectOptions.nfcPairing,
      refreshSessionState: this.connectOptions.refreshSessionState,
      switchProtocol: this.connectOptions.switchProtocol
    };

    try {
      await this.connectWithNfcTag(event.tag, connectionOptions);
    } catch (err) {
      debug("Tap connection service error: ", err);
    }
  }
}

function parseKeys(
  keys?: EncryptionKeys & {
    sessionKeyHex?: string;
    ivEncodeHex?: string;
    ivDecodeHex?: string;
  }
) {
  if (!keys) {
    return undefined;
  }
  if (keys.sessionKeyHex) {
    keys.sessionKey = hexStringToBuffer(keys.sessionKeyHex);
  }
  if (keys.ivEncodeHex) {
    keys.ivEncode = hexStringToBuffer(keys.ivEncodeHex);
  }
  if (keys.ivDecodeHex) {
    keys.ivDecode = hexStringToBuffer(keys.ivDecodeHex);
  }
  return keys;
}
