import { Component, OnDestroy, OnInit } from "@angular/core";
import { AlertController } from "@ionic/angular";
import {
  HostProtocol,
  NetworkMode
} from "@iotize/device-client.js/device/model";
import { ConnectionState } from "@iotize/device-client.js/protocol/api";
import { CurrentDeviceService, TapConfigItem, TapInfo } from "@iotize/ionic";
import { ToastService } from "app-theme";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "tap-connectivity-settings-page",
  templateUrl: "./tap-connectivity-settings-page.component.html",
  styleUrls: ["./tap-connectivity-settings-page.component.scss"]
})
export class TapConnectivitySettingsPageComponent implements OnInit, OnDestroy {
  public TYPES = {
    HostProtocol
  };

  public wifiConfigs?: TapConfigItem[];

  public bluetoothConfig?: TapConfigItem[];

  public nfcConfig?: TapConfigItem[];

  public mqttConfig?: TapConfigItem[];

  generalConfig = [
    {
      key: TapInfo.protocolHostInactivityPeriod,
      editable: true
    }
  ];

  private disposable: Subscription[] = [];

  hostProtocol$?: Observable<HostProtocol>;
  hostProtocolString$?: Observable<string>;
  isConnected$: Observable<boolean>;
  rebootDialog?: Promise<HTMLIonAlertElement> = undefined;
  _isCurrentProtocolCache = {};
  disableRebootButton$: Observable<boolean>;

  get tap() {
    return this.tapService.tap;
  }

  constructor(
    public tapService: CurrentDeviceService,
    private alertController: AlertController,
    private toastService: ToastService
  ) {}

  async refresh() {
    this.tapService.refreshAppState();
  }

  ngOnInit() {
    this.hostProtocol$ = this.tapService.getKeyValue$(TapInfo.HostProtocol);
    this.hostProtocolString$ = this.hostProtocol$.pipe(
      map(v => HostProtocol[v])
    );
    this.isConnected$ = this.tapService.connectionState.pipe(
      map(state => state.newState === ConnectionState.CONNECTED)
    );

    this.disableRebootButton$ = this.isConnected$.pipe(
      map(isConnected => {
        return this.rebootDialog !== undefined || !isConnected;
      })
    );
    const availableHostProtocolsSub = this.tapService
      .getKeyValue$(TapInfo.availableHostProtocols)
      .subscribe((availableProtocols: HostProtocol[]) => {
        if (availableProtocols.indexOf(HostProtocol.WIFI) >= 0) {
          this.wifiConfigs = [
            {
              key: TapInfo.isHostProtocolAuthorized,
              params: [HostProtocol.WIFI],
              editable: true
            },
            {
              key: TapInfo.WifiHostname
            },
            {
              key: TapInfo.wifiSSID,
              editable: true
            },
            {
              key: TapInfo.wifiPassword,
              editable: true
            },
            {
              key: TapInfo.networkMode,
              editable: true,
              input: {
                type: "select",
                options: [
                  {
                    icon: "git-network",
                    key: NetworkMode.INFRASTRUCTURE_ONLY,
                    text: "Network"
                  },
                  {
                    icon: "people",
                    key: NetworkMode.PEER_TO_PEER,
                    text: "Access point"
                  }
                ]
              }
            },
            {
              key: TapInfo.NetworkInfraIp,
              editable: true
            }
          ];
        }

        if (availableProtocols.indexOf(HostProtocol.BLE) >= 0) {
          this.bluetoothConfig = [
            {
              key: TapInfo.isHostProtocolAuthorized,
              params: [HostProtocol.BLE],
              editable: true
            },
            {
              key: TapInfo.bleMacAddress
            }
          ];
        }

        if (availableProtocols.indexOf(HostProtocol.NFC) >= 0) {
          this.nfcConfig = [
            // {
            //   key: TapInfo.isHostProtocolAuthorized,
            //   params: [
            //     HostProtocol.NFC
            //   ],
            //   editable: true
            // },
            {
              key: TapInfo.NFCConnectionPriority,
              editable: true
            },
            {
              key: TapInfo.NFCPairingMode,
              editable: true
            }
          ];
        }

        if (true) {
          this.mqttConfig = [
            // {
            //   key: TapInfo.isHostProtocolAuthorized,
            //   params: [
            //     HostProtocol.NFC
            //   ],
            //   editable: true
            // }
            {
              key: TapInfo.MqttRelayEndpoint,
              editable: true
            },
            {
              key: TapInfo.MqttRelayClientId,
              editable: true
            },
            {
              key: TapInfo.MqttRelayUsername,
              editable: true
            },
            {
              key: TapInfo.MqttRelayPassword,
              editable: true
            }
          ];
        }
      });

    this.disposable.push(availableHostProtocolsSub);
  }

  ngOnDestroy() {
    this.disposable.forEach(sub => sub.unsubscribe());
    this.disposable = [];
  }

  isCurrentProtocol(p: HostProtocol): Observable<boolean> {
    if (!(p in this._isCurrentProtocolCache)) {
      this._isCurrentProtocolCache[p] = this.hostProtocol$.pipe(
        map(current => {
          return current === p;
        })
      );
    }
    return this._isCurrentProtocolCache[p];
  }

  async rebootTap() {
    if (this.rebootDialog === undefined) {
      this.rebootDialog = this.alertController.create({
        header: "Confirm device reboot ?",
        message:
          "Your Tap is going to reboot. According to your new settings, you may loose connection to the Tap. \
            Do you want to reboot now ?",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              this.rebootDialog = undefined;
            }
          },
          {
            text: "Reboot now",
            cssClass: "danger",
            role: "ok",
            handler: async () => {
              this.rebootDialog = undefined;
              try {
                (await this.tap.service.device.reboot()).successful();
                this.showSuccess(`Tap reboot done!`);
                this.tapService.refreshAppState();
              } catch (err) {
                this.showError(`Tap reboot error: ${err.message}`);
              }
            }
          }
        ]
      });
      (await this.rebootDialog).present();
    }
  }

  showError(msg: string) {
    this.toastService.error({
      message: msg
    });
  }

  showSuccess(msg: string) {
    this.toastService.success({
      message: msg
    });
  }
}
