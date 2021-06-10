import "@iotize/tap/ext/data";

import { Injectable } from "@angular/core";
import { ConnectionState } from "@iotize/tap/protocol/api";
import { CurrentDeviceService } from "@iotize/ionic";
import { MonitoringSettings } from "@iotize/ionic/monitoring";
import { MonitorEngine } from "@iotize/tap/data";

@Injectable({
  providedIn: "root"
})
export class TapMonitoringService {
  public settings: MonitoringSettings = {
    period: 1000
  };

  constructor(public tapService: CurrentDeviceService) {
    this.tapService.connectionState.subscribe(event => {
      if (event.newState !== ConnectionState.CONNECTED && this.isRunning) {
        this.stop();
      }
    });
  }

  get isRunning() {
    if (!this.tapService.hasTap) {
      return false;
    }
    return (
      this.tapService.tap.data.monitoring.state === MonitorEngine.State.START
    );
  }

  public applyNewSettings(newSettings: MonitoringSettings) {
    this.settings = newSettings;
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  public start() {
    if (!this.tapService.hasTap) {
      return;
    }
    this.tapService.tap.data.monitoring.start({
      period: this.settings.period
    });
  }

  public stop() {
    if (!this.tapService.hasTap) {
      return;
    }
    this.tapService.tap.data.monitoring.stop();
  }
}
