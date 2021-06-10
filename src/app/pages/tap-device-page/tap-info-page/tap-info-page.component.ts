import { Component, OnInit } from "@angular/core";
import { CurrentDeviceService, TapInfo } from "@iotize/ionic";

@Component({
  selector: "tap-info-page",
  templateUrl: "./tap-info-page.component.html",
  styleUrls: ["./tap-info-page.component.scss"]
})
export class TapInfoPageComponent implements OnInit {
  public get tap() {
    return this.tapService.tap;
  }

  constructor(private tapService: CurrentDeviceService) {}

  async ngOnInit() {}
}
