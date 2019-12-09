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
  selector: "count-control",
  templateUrl: "./count-control.component.html",
  styleUrls: ["./count-control.component.scss"]
})
export class CountControlComponent implements OnInit, OnDestroy {
  private connectionStateChangeSub: Subscription;

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
  }

  public initComponents() {}

  ngOnDestroy() {
    this.connectionStateChangeSub.unsubscribe();
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

  async changeDevice() {
    await this.tapService.remove();
    this.router.navigate(["/"]);
  }
}
