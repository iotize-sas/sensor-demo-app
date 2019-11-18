import { Component, OnInit, OnDestroy } from "@angular/core";
import { CurrentDeviceService, TapInfo } from "@iotize/ionic";
import {
  ConnectionStateChangeEvent,
  ConnectionState
} from "@iotize/device-client.js/protocol/api";
import { Subscription, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ModalController } from "@ionic/angular";
import {
  TapMonitoringSettingsComponent,
  MonitoringSettingsService,
  SubVariableInteraction
} from "@iotize/ionic";
import { VariableInteraction } from "@iotize/device-client.js/device/target-variable/variable-interaction.interface";
import { SensorDemo } from "tap-api";
import { VariableConfig } from "@iotize/device-client.js/device/target-variable/variable";
import { Router, NavigationStart } from "@angular/router";
import { TapMonitoringService } from "app-lib";
import { Tap } from "@iotize/device-client.js/device";

@Component({
  selector: "admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"]
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private connectionStateChangeSub: Subscription;

  private monitoringSettingsSub: Subscription;

  private _subVariableCache: Record<string, SubVariableInteraction<any>> = {};

  waitForSubmit: boolean = false;
  isMonitorRunning: boolean = false;
  get data() {
    return this.monitoringService.data;
  }

  constructor(
    public tapService: CurrentDeviceService,
    private modalController: ModalController,
    private monitoringSettingsService: MonitoringSettingsService,
    public monitoringService: TapMonitoringService,
    private router: Router
  ) {}

  LEDStatusIsChecked?: Observable<boolean>;

  Temperature_CChartData = [
    {
      stream: this.variables["Temperature_C"].monitor().values(),
      label: "Temperature_C"
    }
  ];

  LEDConfigButtons = [
    {
      label: "OFF",
      icon: "",
      disabled: false,
      value: 0
    },

    {
      label: "ON",
      icon: "",
      disabled: false,
      value: 1
    },

    {
      label: "AUTO",
      icon: "",
      disabled: false,
      value: 2
    }
  ];

  async ngOnInit() {
    this.initComponents();
    this.tapService.tapChanged.subscribe((newTap: Tap) => {
      this.initComponents();
    });

    this.waitForSubmit = !this.tapService.tap.isConnected();

    this.connectionStateChangeSub = this.tapService.connectionState.subscribe(
      (event: ConnectionStateChangeEvent) => {
        switch (event.newState) {
          case ConnectionState.CONNECTED:
            this.waitForSubmit = false;
            if (this.monitoringService.data.isMonitoringRunning) {
              this.monitoringService.data.refresh();
            }
            break;
          default:
            this.waitForSubmit = true;
        }
      }
    );

    this.monitoringSettingsSub = this.monitoringSettingsService.settings$.subscribe(
      newSettings => {
        this.data.setMonitoringPeriod(newSettings.period);
      }
    );
    this.startMonitor();
  }

  public initComponents() {
    this.LEDStatusIsChecked = this.variables["LEDStatus"]
      .monitor()
      .values()
      .pipe(
        map(value => {
          return value !== 0;
        })
      );
  }

  ngOnDestroy() {
    this.connectionStateChangeSub.unsubscribe();

    this.monitoringSettingsSub.unsubscribe();
  }

  get variables() {
    return this.data.variables;
  }

  subVariable(variable: VariableConfig<any[]>, index: number) {
    let key = `${variable.identifier()}.${index}`;
    if (!(key in this._subVariableCache)) {
      this._subVariableCache[key] = new SubVariableInteraction(variable, index);
    }
    return this._subVariableCache[key];
  }

  get tap() {
    return this.tapService.tap;
  }

  get isMonitoringRunning() {
    return this.data && this.data.isMonitoringRunning;
  }

  stopMonitor() {
    this.data.stopAll();
  }

  async startMonitor() {
    await this.tap.service.target.connect().catch(err => console.warn(err));
    this.data.startAll(this.monitoringSettingsService.settings.period);
  }

  async openSettings() {
    const modal = await this.modalController.create({
      component: TapMonitoringSettingsComponent
    });

    return await modal.present();
  }
}
