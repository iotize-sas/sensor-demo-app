import { NgModule } from "@angular/core";
import { TapDevicePageComponent } from "./tap-device-page.component";
import { TapDevicePageRoutingModule } from "./tap-device-page-routing.module";
import { TapAuthModule } from "@iotize/ionic";
import { AppThemeModule } from "app-theme";

@NgModule({
  declarations: [TapDevicePageComponent],
  entryComponents: [],
  imports: [AppThemeModule, TapDevicePageRoutingModule, TapAuthModule],
  providers: []
})
export class TapDevicePageModule {}
