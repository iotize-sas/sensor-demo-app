import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { CurrentDeviceService, TapInfo, TapConfigItem } from "@iotize/ionic";
import { ToastService } from "app-theme";
import { HostProtocol } from "@iotize/tap";

@Component({
  selector: "tap-config-page",
  templateUrl: "./tap-config-page.component.html",
  styleUrls: ["./tap-config-page.component.scss"]
})
export class TapConfigPageComponent implements OnInit {
  protocolSections: {
    title: string;
    icon?: string;
    items: TapConfigItem[];
  }[] = [];

  public interfaceTapConfigItems = [
    {
      key: "appName",
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
  public bundle_SensorsConfigItem = [
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

  async ngOnInit() {}

  private onError(err: Error) {
    this.toastService.error(err);
  }
}
