import { Component, OnInit } from "@angular/core";
import { ProtocolSelectedEvent } from "@iotize/ionic";
import { MyTapConnectionService } from "src/app/my-tap-connection.service";

@Component({
  selector: "app-tap-connect-mqtt-tab",
  templateUrl: "./tap-connect-mqtt-tab.component.html",
  styleUrls: ["./tap-connect-mqtt-tab.component.scss"]
})
export class TapConnectMqttTabComponent implements OnInit {
  public error?: Error;

  constructor(public tapConnectionService: MyTapConnectionService) {}

  ngOnInit() {}

  async onProtocolSelected(event: ProtocolSelectedEvent) {
    console.log("onProtocolSelected", event);
    this.tapConnectionService.connectWithLoader(event.meta);
  }

  onError(err: Error) {
    this.error = err;
  }
}
