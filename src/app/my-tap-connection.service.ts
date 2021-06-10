import { Injectable, Inject } from "@angular/core";
import { last, share, switchMap } from "rxjs/operators";
import { of, Observable, defer } from "rxjs";
import {
  ProtocolMeta,
  ConnectionEvent,
  TapConnectionService,
  TAP_CONNECTION_OPTIONS_PROVIDER,
  TagDiscoveredEvent,
  NfcService,
  tagToProtocolMetaNFC,
  RecoverableTapStateEvent,
  CurrentDeviceService,
  TapConnectionOptions,
  TapConnectionStoreService
} from "@iotize/ionic";
import { Platform } from "@ionic/angular";
import { ToastService, AppNavigationService, LoaderService } from "app-theme";
import getDebugger from "src/app/logger";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { EncryptionKeys } from "@iotize/tap/auth";
import { hexStringToBuffer } from "@iotize/common/byte-converter";
import { Dialogs } from "@ionic-native/dialogs/ngx";

import { NdefTag } from "@iotize/device-com-nfc.cordova";

const debug = getDebugger("MyTapConnectionService");

export interface MyTapConnectionOptions extends TapConnectionOptions {
  /**
   * Default redirection url when tap is connected and if there is not
   * 'returnUrl' query parameter on current route
   */
  returnUrl?: string | null;
}

@Injectable({
  providedIn: "root"
})
export class MyTapConnectionService {
  _ndefTag: NdefTag;

  private deviceHomeUrl = "/device";

  private switchTapDialogId?: Promise<void>;

  constructor(
    public tapConnectionService: TapConnectionService,
    public toastService: ToastService,
    public tapService: CurrentDeviceService,
    public appNav: AppNavigationService,
    public loaderService: LoaderService,
    public route: ActivatedRoute,
    private dialogs: Dialogs,

    public tapConnectionStoreService: TapConnectionStoreService,

    public platform: Platform,
    @Inject(TAP_CONNECTION_OPTIONS_PROVIDER)
    public connectOptions: MyTapConnectionOptions,
    public router: Router,
    public nfcService: NfcService
  ) {}

  connectWithLoader(
    meta: ProtocolMeta,
    options: MyTapConnectionOptions = this.connectOptions
  ): Observable<ConnectionEvent> {
    debug("connectWithLoader ", meta, options);
    let obs = this.tapConnectionService.connect(meta, options).pipe(
      last(),
      switchMap(connectionEvent => {
        return of({
          message: "Loading application...",
          tap: connectionEvent.tap
        });
      }),
      switchMap(connectionEvent => {
        return defer(async () => {
          await this.redirectAfterTapConnectionIfRequired(options);
          return {
            tap: connectionEvent.tap,
            message: "Application loaded!"
          };
        });
      })
    );

    obs = obs.pipe(
      switchMap(connectionEvent => {
        debug("connectWithLoader  storeCurrentTapInfo...");
        this.tapConnectionStoreService
          .storeCurrentTapConnectionInfo()
          .then(result => {
            debug(`connectWithLoader storeCurrentTapInfo`, result);
          })
          .catch(err => {
            console.error(`Cannot store current tap info`, err);
          });
        return of(connectionEvent);
      })
    );

    obs = obs.pipe(share());
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

  resolveReturnUrl(options: MyTapConnectionOptions): string {
    return this.route.snapshot.queryParams["returnUrl"] || options.returnUrl;
  }

  private shouldRedirectAfterConnection(options: MyTapConnectionOptions) {
    return !!this.resolveReturnUrl(options);
  }

  async redirectAfterTapConnectionIfRequired(options: MyTapConnectionOptions) {
    let returnUrl = this.resolveReturnUrl(options);
    if (!returnUrl && this.router.routerState.snapshot.url === "/connect") {
      returnUrl = "/device";
    }
    if (returnUrl) {
      await this.appNav.waitForNavigationEnd(returnUrl, 10000).toPromise();
    } else {
      console.warn(`No redirection required after tap connection`);
    }
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
    connectOptions: MyTapConnectionOptions = this.connectOptions
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
          await this.onNewNfcDevice(nfcProtocolMeta, connectOptions);
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

  async onNewNfcDevice(
    nfcProtocolMeta: ProtocolMeta,
    connectOptions: MyTapConnectionOptions
  ) {
    if (this.switchTapDialogId === undefined) {
      this.switchTapDialogId = this.dialogs
        .confirm(
          "You are trying to connect to another device. Do you want to continue ?",
          undefined,
          [`Continue`, "Cancel"]
        )
        .then(async choice => {
          this.switchTapDialogId = undefined;
          switch (choice) {
            case 1: // User click continue
              connectOptions.returnUrl = this.router.routerState.snapshot.url;
              this.router.navigate(["/"]);
              await this.tapService.remove();
              await this.connectWithLoader(
                nfcProtocolMeta,
                connectOptions
              ).toPromise();
            case 2: // User click never
              break;
            case 0: // User dismiss
            default:
              break;
          }
        })
        .catch(err => {
          this.switchTapDialogId = undefined;
          console.warn(err);
        });
    }
  }

  async onNfcDiscoveredEvent(
    tag: NdefTag,
    connectOptions: MyTapConnectionOptions = this.connectOptions
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

    let connectionOptions: MyTapConnectionOptions = {
      encryption: {
        encryption: tapState.encryption?.encryption || false,
        keys: parseKeys(tapState.encryption?.keys),
        frameCounter: tapState.encryption.frameCounter,
        initializationVectorResetPeriod: 100
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
