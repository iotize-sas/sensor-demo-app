import { Component, OnInit } from "@angular/core";
import {
  ProtocolSelectedEvent,
  TapConnectMqttComponentFormData
} from "@iotize/ionic";

import { TapConnectionStoreItem } from "@iotize/ionic";

import { MyTapConnectionService } from "src/app/my-tap-connection.service";

@Component({
  selector: "app-tap-connect-mqtt-tab",
  templateUrl: "./tap-connect-mqtt-tab.component.html",
  styleUrls: ["./tap-connect-mqtt-tab.component.scss"]
})
export class TapConnectMqttTabComponent implements OnInit {
  public error?: Error;

  formDefaults: TapConnectMqttComponentFormData;

  tapConnectionStored?: TapConnectionStoreItem[];

  constructor(public tapConnectionService: MyTapConnectionService) {
    this.formDefaults = {
      endpoint: "wss://user.cloud.iotize.com:9883",
      serialNumber: "",
      netKey: "testnetkey",
      password: ""
    };
  }

  ngOnInit() {}

  async onProtocolSelected(event: ProtocolSelectedEvent) {
    this.tapConnectionService.connectWithLoader(event.meta);
  }

  onError(err: Error) {
    this.error = err;
  }

  onStoredTapSelected(info: TapConnectionStoreItem) {
    this.tapConnectionService.connectWithLoader(info.connection);
  }
}
