import { NgModule } from "@angular/core";
import { TapDevicePageComponent } from "./tap-device-page.component";
import { TapDevicePageRoutingModule } from "./tap-device-page-routing.module";
import { TaskManagerUiModule } from "@iotize/ionic";
import { TapAuthModule } from "@iotize/ionic/auth";
import { AppThemeModule } from "app-theme";

@NgModule({
  declarations: [TapDevicePageComponent],
  entryComponents: [],
  imports: [
    AppThemeModule,
    TapDevicePageRoutingModule,
    TapAuthModule,
    TaskManagerUiModule
  ],
  providers: []
})
export class TapDevicePageModule {}
