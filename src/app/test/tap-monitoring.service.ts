import { Injectable } from "@angular/core";
import { CurrentDeviceService } from "@iotize/ionic";
import { SensorDemo } from "tap-api";
import { Tap } from "@iotize/device-client.js/device";

@Injectable({
  providedIn: "root"
})
export class TapMonitoringService {
  public data: SensorDemo.DataManager;

  constructor(tapService: CurrentDeviceService) {
    this.data = SensorDemo.DataManager.create(tapService.tap);

    tapService.tapChanged.subscribe((newTap: Tap) => {
      console.info("Tap changed!");
      if (this.data) {
        this.data.stopAll();
      }
      this.data = SensorDemo.DataManager.create(newTap);
    });
  }

  public stop() {
    if (this.data) {
      this.data.stopAll();
    }
  }
}
