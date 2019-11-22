import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { CurrentDeviceService, TapInfo, TapConfigItem } from "@iotize/ionic";
import { ToastService } from "app-theme";
import { HostProtocol } from "@iotize/device-client.js/device/model";

@Component({
  selector: "tap-settings-page",
  templateUrl: "./tap-settings-page.component.html",
  styleUrls: ["./tap-settings-page.component.scss"]
})
export class TapSettingsPageComponent implements OnInit {
  protocolSections: {
    title: string;
    icon?: string;
    items: TapConfigItem[];
  }[] = [];

  public interfaceTapConfigItems = [
    {
      key: "appName",
      editable: true
    },
    {
      key: "protocolHostInactivityPeriod",
      editable: true
    }
  ];
  public mqttRelayConfigItems = [
    {
      key: "MqttRelayEndpoint",
      editable: true,
      title: "Endpoint"
    },
    {
      key: "MqttRelayPassword",
      editable: true,
      title: "Password"
    }
  ];
  public cloudConfigItems = [
    {
      key: "CloudEndpoint",
      editable: true,
      title: "Endpoint"
    },
    {
      key: "CloudKey",
      editable: true,
      title: "Password"
    },
    {
      key: "CloudUploadPeriod",
      editable: true
    }
  ];
  public profile_adminConfigItem = [
    {
      key: "ProfileLifeTime",
      editable: true,
      params: ["65535"]
    },
    {
      key: "profilePassword",
      editable: true,
      params: ["65535"]
    }
  ];
  public profile_supervisorConfigItem = [
    {
      key: "ProfileLifeTime",
      editable: true,
      params: ["65534"]
    },
    {
      key: "profilePassword",
      editable: true,
      params: ["65534"]
    }
  ];
  public profile_techConfigItem = [
    {
      key: "ProfileLifeTime",
      editable: true,
      params: ["1"]
    },
    {
      key: "profilePassword",
      editable: true,
      params: ["1"]
    }
  ];
  public bundle_Count_StatusConfigItem = [
    {
      key: "BundleDatalogPeriod",
      editable: true,
      params: ["0"]
    }
  ];
  public bundle_MySensorsConfigItem = [
    {
      key: "BundleDatalogPeriod",
      editable: true,
      params: ["1"]
    }
  ];
  public bundle_Count_ControlConfigItem = [
    {
      key: "BundleDatalogPeriod",
      editable: true,
      params: ["2"]
    }
  ];

  public get tap() {
    return this.tapService.tap;
  }

  constructor(
    private tapService: CurrentDeviceService,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    this.tapService
      .getKeyValue$(TapInfo.availableHostProtocols)
      .subscribe((protocols: HostProtocol[]) => {
        this.initHostProtocolsOptions(protocols);
      });
  }

  private onError(err: Error) {
    this.toastService.error(err);
  }

  initHostProtocolsOptions(availableHostProtocols: HostProtocol[]) {
    this.protocolSections = [];
    for (let protocol of availableHostProtocols) {
      let icon: string | undefined = undefined;
      let items: TapConfigItem[] = [
        {
          key: TapInfo.isHostProtocolAuthorized,
          params: [protocol],
          editable: true
        }
      ];
      switch (protocol) {
        case HostProtocol.BLE:
          // icon = 'bluetooth';
          items.push({
            key: TapInfo.bleMacAddress
          });
          break;
        case HostProtocol.WIFI:
          // icon = 'wifi';
          items.push(
            {
              key: TapInfo.wifiSSID,
              editable: true
            },
            {
              key: TapInfo.wifiPassword,
              editable: true
            }
          );
          break;
        case HostProtocol.NFC:
          // icon = 'src:assets/svg/nfc.svg';
          break;
      }
      this.protocolSections.push({
        title: HostProtocol[protocol].toString(),
        items: items,
        icon: icon
      });
    }
  }
}
