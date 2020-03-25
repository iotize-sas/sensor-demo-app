import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { ModalController, MenuController } from "@ionic/angular";
import {
  CurrentDeviceService,
  TapInfo,
  LONG_RANGE_PROTOCOL_FILTER,
  ProtocolMeta,
  ProtocolFactoryService,
  TaskManagerService,
  TaskManager
} from "@iotize/ionic";
import { ChangePasswordComponent } from "@iotize/ionic/auth";
import { DeviceLoginComponent } from "@iotize/ionic/auth";
import { Router } from "@angular/router";
import { DEVICE_MENU } from "./tap-device-page.menu";
import { Observable, Subscription } from "rxjs";
import {
  ConnectionStateChangeEvent,
  ConnectionState
} from "@iotize/device-client.js/protocol/api";
import { Dialogs } from "@ionic-native/dialogs/ngx";
import { environment } from "src/environments/environment";
import { MenuItem, ToastService, AppNavigationService } from "app-theme";
import getDebugger from "src/app/logger";
import { filter, map } from "rxjs/operators";
const debug = getDebugger("TapDevicePageComponent");

@Component({
  selector: "app-device",
  templateUrl: "./tap-device-page.component.html",
  styleUrls: ["./tap-device-page.component.scss"]
})
export class TapDevicePageComponent implements OnInit, OnDestroy {
  public pages: MenuItem[] = DEVICE_MENU;
  public appTitle = environment.appName;

  public appName: Observable<string>;
  public isConnecting: Observable<boolean>;
  public isDisconnecting: Observable<boolean>;
  private connectionLostSub: Subscription;
  public askSwitchProtocolOnNFCConnectionLost: boolean = true;
  public isAnonymous$: Observable<boolean>;
  public tapLogoutTask: TaskManager.TaskContainer;

  private connectionLostDialogId?: Promise<void>;

  public routerLoading = this.appNav.loading;

  public get tap() {
    return this.tapService.tap;
  }

  get isNFC() {
    return (
      this.tapService.protocolMeta &&
      this.tapService.protocolMeta.type === "nfc"
    );
  }

  public get protocolMeta(): Observable<ProtocolMeta | undefined> {
    return this.tapService.protocolMeta$;
  }

  public get availableProtocols(): Observable<ProtocolMeta[]> {
    return this.tapService.availableProtocols$;
  }

  constructor(
    public tapService: CurrentDeviceService,
    private router: Router,
    private menu: MenuController,
    public toastService: ToastService,
    public modalController: ModalController,
    public protocolFactory: ProtocolFactoryService,
    private appNav: AppNavigationService,
    private dialogs: Dialogs,
    private taskManager: TaskManagerService
  ) {
    this.tapLogoutTask = this.taskManager.createTask({
      id: "tap-logout",
      info: {
        title: "Tap logout",
        feedback: "Logout successful!"
      },
      exec: () => {
        return this.tapService.logout(true);
      }
    });
    this.isAnonymous$ = this.tapService.isLoggedInAs$("anonymous");
  }

  ngOnInit() {
    this.appName = this.tapService.getKeyValue$(TapInfo.appName);
    this.isConnecting = this.tapService.connectionState.pipe(
      map(event => event.newState === ConnectionState.CONNECTING)
    );
    this.isDisconnecting = this.tapService.connectionState.pipe(
      map(event => event.newState === ConnectionState.DISCONNECTING)
    );
    this.connectionLostSub = this.tapService.connectionLost.subscribe(
      (event: ConnectionStateChangeEvent) => {
        this._onTapConnectionLost();
      }
    );

    this.tapService.tapChanged.subscribe(_event => {
      debug("tap changed! refreshing app state...");
      this.tapService.infoResolver.refreshKeys([
        TapInfo.appName,
        TapInfo.serialNumber
      ]);
    });
  }

  public hasTap(): boolean {
    return this.tapService && Boolean(this.tapService.protocolMeta);
  }

  private _onTapConnectionLost() {
    debug("_onTapConnectionLost");
    if (this.connectionLostDialogId) {
      return;
    }
    let protocolMeta = this.tapService.protocolMeta;
    if (protocolMeta) {
      // If we get disconnected from NFC, we can ask user if he wants to be connected to a long range
      // protocol
      if (protocolMeta.type === "nfc") {
        let newProtocolMeta:
          | ProtocolMeta
          | undefined = this.tapService.availableProtocols.find(
          LONG_RANGE_PROTOCOL_FILTER
        );

        if (newProtocolMeta && this.askSwitchProtocolOnNFCConnectionLost) {
          this.connectionLostDialogId = this.dialogs
            .confirm(
              `You have been disconnected from NFC. Your device has ${newProtocolMeta.type}. Do you want to connect with ${newProtocolMeta.type}?`,
              `NFC connection lost`,
              [`Use ${newProtocolMeta.type}`, "Never", "Ignore"]
            )
            .then(choice => {
              this.connectionLostDialogId = undefined;
              switch (choice) {
                case 1: // User click ok
                  return this.tapService
                    .useProtocolFromMeta(newProtocolMeta)
                    .catch(err => {
                      this.onError(err);
                    });
                case 2: // User click never
                  this.askSwitchProtocolOnNFCConnectionLost = false;
                  break;
                case 3: // User click ignore
                case 0: // User dismiss
                default:
                  break;
              }
            })
            .catch(err => {
              console.error(`Cannot change protocol: `, err);
              this.connectionLostDialogId = undefined;
              this.onError(err);
            });
        }
      }
    }
  }

  onError(err: Error) {
    debug("onError", err);
    this.toastService.error({
      message: err.message || "Unknown error"
    });
  }

  clickProfileName() {
    if (this.tap.currentSessionState.name !== "anonymous") {
      this.changePassword();
    }
  }

  async login() {
    console.log("Show login model");
    const modal = await this.modalController.create({
      component: DeviceLoginComponent
    });
    modal.present();
  }

  async logout() {
    await this.tapService.logout();
  }

  async changePassword() {
    console.log("Show change password modal");
    const modal = await this.modalController.create({
      component: ChangePasswordComponent,
      componentProps: {
        askCurrentPassword: true
      }
    });
    modal.present();
  }

  async changeDevice() {
    await this.menu.close();
    await this.tapService.remove();
    this.router.navigate(["/connect"]);
  }

  ngOnDestroy(): void {
    this.connectionLostSub.unsubscribe();
  }

  tapConnect() {
    if (!this.hasTap()) {
      this.menu.close();
      this.router.navigateByUrl("/device/connect");
    } else {
      this.tapService.connect();
    }
  }

  selectProtocolChange(
    event: CustomEvent<{ value: ProtocolMeta | undefined }>
  ) {
    console.log("selectProtocolChange", event);
    if (event.detail.value) {
      this.tapService.useProtocolFromMeta(event.detail.value).catch(err => {
        this.onError(err);
      });
    }
  }
}
