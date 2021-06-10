import { Component, OnInit, Inject } from "@angular/core";
import { RefresherEventDetail } from "@ionic/core";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";
import { ProtocolSelectedEvent, TAP_BLE_SCANNER } from "@iotize/ionic";
import { Subject } from "rxjs";
import { AppNavigationService, ToastService } from "app-theme";
import { MyTapConnectionService } from "src/app/my-tap-connection.service";
import { DeviceScanner } from "@iotize/tap/scanner/api";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-tap-connect-ble-tab",
  templateUrl: "./tap-connect-ble-tab.component.html",
  styleUrls: ["./tap-connect-ble-tab.component.scss"]
})
export class TapConnectBleTabComponent implements OnInit {
  error?: Error;
  private readonly destroyed = new Subject<void>();
  public isScanning = false;

  constructor(
    private myTapConnectionService: MyTapConnectionService,
    public platform: Platform,
    @Inject(TAP_BLE_SCANNER) public scanner: DeviceScanner<any>,
    public toastService: ToastService,
    public appNav: AppNavigationService,
    public router: Router
  ) {}

  get results() {
    return this.scanner.results;
  }

  async ngOnInit() {
    this.scanner.scanning.pipe(takeUntil(this.destroyed)).subscribe(v => {
      if (v !== this.isScanning) {
        this.isScanning = v;
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  async onProtocolSelected(event: ProtocolSelectedEvent) {
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

  refresh(event: CustomEvent<RefresherEventDetail>) {
    this.scanner.start().catch((err: Error) => this.onError(err));
    event.detail.complete();
  }
}
