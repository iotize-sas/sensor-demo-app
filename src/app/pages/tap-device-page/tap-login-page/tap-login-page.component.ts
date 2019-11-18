import { Component, OnInit } from "@angular/core";
import { CurrentDeviceService } from "@iotize/ionic";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "tap-login-page",
  templateUrl: "./tap-login-page.component.html",
  styleUrls: ["./tap-login-page.component.scss"]
})
export class TapLoginPageComponent implements OnInit {
  returnUrl: string;

  public get tap() {
    return this.tapService.tap;
  }

  constructor(
    private tapService: CurrentDeviceService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/device";
  }
}
