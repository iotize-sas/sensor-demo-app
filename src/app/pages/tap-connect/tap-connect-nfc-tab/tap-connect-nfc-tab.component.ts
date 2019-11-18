import { Component, OnInit } from "@angular/core";
import { Platform } from "@ionic/angular";

declare var nfc: any;

@Component({
  selector: "app-tap-connect-nfc-tab",
  templateUrl: "./tap-connect-nfc-tab.component.html",
  styleUrls: ["./tap-connect-nfc-tab.component.scss"]
})
export class TapConnectNfcTabComponent implements OnInit {
  error: Error;

  constructor(private platform: Platform) {}

  ngOnInit() {}

  onProtocolSelected(event) {
    // Nothing to do here as this is already handle in AppComponent
  }

  onError(err: Error) {
    this.error = err;
  }

  startScan() {
    if (this.ios) {
      nfc.beginNDEFSession();
    }
  }

  get ios() {
    return this.platform.is("ios");
  }
}
