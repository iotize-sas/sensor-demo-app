import { Component, OnInit } from "@angular/core";
import { Platform } from "@ionic/angular";
import { NdefTag } from "@iotize/device-com-nfc.cordova";
import { MyTapConnectionService } from "src/app/my-tap-connection.service";
@Component({
  selector: "app-tap-connect-nfc-tab",
  templateUrl: "./tap-connect-nfc-tab.component.html",
  styleUrls: ["./tap-connect-nfc-tab.component.scss"]
})
export class TapConnectNfcTabComponent implements OnInit {
  error: Error;
  constructor(
    private platform: Platform,
    private myTapConnectionService: MyTapConnectionService
  ) {}
  ngOnInit() {}
  onProtocolSelected(event) {
    // Nothing to do here as this is already handle in AppComponent
  }
  onError(err: Error) {
    this.error = err;
  }
  startScan() {
    if (this.ios) {
      let tag: NdefTag = {
        canMakeReadOnly: false,
        ndefMessage: [],
        id: [],
        isWritable: true,
        maxSize: 0,
        techTypes: []
      };
      this.myTapConnectionService.onNfcDiscoveredEvent(tag);
    }
  }
  get ios() {
    return this.platform.is("ios");
  }
}
