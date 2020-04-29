import { Component, OnInit, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { ProtocolSelectedEvent, TAP_BLE_SCANNER } from "@iotize/ionic";
import { Observable } from "rxjs";
import { AppNavigationService, ToastService } from "app-theme";
import { MyTapConnectionService } from "src/app/my-tap-connection.service";
import { DeviceScanner } from "@iotize/device-client.js/scanner/api";

@Component({
  selector: "app-connect-ble",
  templateUrl: "./connect-ble.component.html",
  styleUrls: ["./connect-ble.component.scss"]
})
export class TapConnectBleTabComponent implements OnInit {
  error?: Error;

  constructor(
    private myTapConnectionService: MyTapConnectionService,
    public platform: Platform,
    @Inject(TAP_BLE_SCANNER) public scanner: DeviceScanner<any>,
    public toastService: ToastService,
    public appNav: AppNavigationService,
    public router: Router
  ) {}

  get isScanning(): Observable<boolean> {
    return this.scanner.scanning;
  }

  get results() {
    return this.scanner.results;
  }

  async ngOnInit() {}

  ngOnDestroy() {}

  async onProtocolSelected(event: ProtocolSelectedEvent) {
    console.log("onProtocolSelected", event);
    this.scanner.stop();
    this.myTapConnectionService.connectWithLoader(event.meta);
  }

  onError(err: Error) {
    this.error = err;
  }

  startScan() {
    this.error = undefined;
    this.scanner.start().catch((err: Error) => this.onError(err));
  }

  stopScan() {
    this.scanner.stop().catch((err: Error) => this.onError(err));
  }

  refresh(event: any) {
    this.scanner.start().catch((err: Error) => this.onError(err));
    event.target.complete();
  }
}
