import { Component, OnDestroy, OnInit } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { HostProtocol } from "@iotize/tap";
import { WifiMode } from "@iotize/tap/service/impl/wifi";
import { ConnectionState } from "@iotize/tap/protocol/api";
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

  public bleConfig?: TapConfigItem[];

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
              key: TapInfo.WifiMode,
              editable: true
            },
            {
              key: TapInfo.WifiHostname
            },
            {
              key: TapInfo.WifiSSID,
              editable: true
            },
            {
              key: TapInfo.WifiKey,
              editable: true
            },
            {
              key: TapInfo.NetworkInfraIp,
              editable: true
            }
          ];
        }

        if (availableProtocols.indexOf(HostProtocol.BLE) >= 0) {
          this.bleConfig = [
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
            {
              key: TapInfo.isHostProtocolAuthorized,
              params: [HostProtocol.MQTT],
              editable: true
            },
            {
              key: TapInfo.MqttBrokerHostname,
              editable: true
            },
            {
              key: TapInfo.MqttBrokerPort,
              editable: true
            },
            {
              key: TapInfo.MqttClientId,
              editable: true
            },
            {
              key: TapInfo.MqttUsername,
              editable: true
            },
            {
              key: TapInfo.MqttPassword,
              editable: true
            },
            {
              key: TapInfo.MqttRelayNetKey,
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
