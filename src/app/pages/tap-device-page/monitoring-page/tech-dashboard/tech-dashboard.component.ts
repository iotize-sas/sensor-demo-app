import { Component, OnInit, OnDestroy } from "@angular/core";
import { CurrentDeviceService, TapInfo } from "@iotize/ionic";
import {
  ConnectionStateChangeEvent,
  ConnectionState
} from "@iotize/device-client.js/protocol/api";
import { Subscription, Observable } from "rxjs";
import { ToastService } from "app-theme";
import { map } from "rxjs/operators";
import { ModalController } from "@ionic/angular";
import { SubVariableInteraction } from "@iotize/ionic";
import { TapMonitoringSettingsComponent } from "@iotize/ionic/monitoring";
import { MonitoringSettingsService } from "@iotize/ionic/monitoring";
import { VariableInteraction } from "@iotize/device-client.js/device/target-variable/variable-interaction.interface";
import { SensorDemo } from "tap-api";
import { VariableConfig } from "@iotize/device-client.js/device/target-variable/variable";
import { Router, NavigationStart } from "@angular/router";
import { TapMonitoringService } from "app-lib";
import { Tap } from "@iotize/device-client.js/device";

const DEFAULT_TARGET_CONNECT_TRY_COUNT = 2;

@Component({
  selector: "tech-dashboard",
  templateUrl: "./tech-dashboard.component.html",
  styleUrls: ["./tech-dashboard.component.scss"]
})
export class TechDashboardComponent implements OnInit, OnDestroy {
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
    private toastService: ToastService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.initComponents();
    this.tapService.tapChanged.subscribe((newTap: Tap) => {
      this.initComponents();
    });

    this.waitForSubmit = !this.tapService.tap.isConnected();

    this.connectionStateChangeSub = this.tapService.connectionState.subscribe(
      async (event: ConnectionStateChangeEvent) => {
        switch (event.newState) {
          case ConnectionState.CONNECTED:
            this.waitForSubmit = false;
            if (this.monitoringService.data.isMonitoringRunning) {
              try {
                await this.connectToTarget();
                this.monitoringService.data.refresh();
              } catch (err) {
                this.showError(err);
              }
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

  public initComponents() {}

  ngOnDestroy() {
    this.connectionStateChangeSub.unsubscribe();

    this.monitoringSettingsSub.unsubscribe();
  }

  get variables() {
    return this.data.variables;
  }

  subVariable(variable: VariableConfig<any[]>, index: number) {
    const key = `${variable.identifier()}.${index}`;
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
    try {
      await this.connectToTarget();
      this.data.startAll(this.monitoringSettingsService.settings.period);
    } catch (err) {
      this.showError(err);
    }
  }

  async openSettings() {
    const modal = await this.modalController.create({
      component: TapMonitoringSettingsComponent
    });

    return await modal.present();
  }

  async connectToTarget(
    maxTry: number = DEFAULT_TARGET_CONNECT_TRY_COUNT
  ): Promise<number> {
    for (let tryNumber = 1; tryNumber <= maxTry; tryNumber++) {
      try {
        (await this.tap.service.target.connect()).successful();
        return tryNumber;
      } catch (err) {
        if (tryNumber >= maxTry) {
          throw new Error(`Device was not able to connect to the target after 
          ${maxTry} attempt(s). Cause: ${err.message}`);
        }
      }
    }
    return 0;
  }

  async changeDevice() {
    await this.tapService.remove();
    this.router.navigate(["/"]);
  }

  async showError(err: Error) {
    this.toastService.error(err);
  }
}
