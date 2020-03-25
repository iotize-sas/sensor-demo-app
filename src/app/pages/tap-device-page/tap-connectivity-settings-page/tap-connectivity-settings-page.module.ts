import { NgModule } from "@angular/core";
import { AppThemeModule } from "app-theme";
import { TapConnectivitySettingsPageRoutingModule } from "./tap-connectivity-settings-page-routing.module";
import { TapConnectivitySettingsPageComponent } from "./tap-connectivity-settings-page.component";
import { TapAuthModule } from "@iotize/ionic/auth";
import { TapConfigModule } from "@iotize/ionic/config";

@NgModule({
  declarations: [TapConnectivitySettingsPageComponent],
  imports: [
    AppThemeModule,
    TapConnectivitySettingsPageRoutingModule,
    TapAuthModule,
    TapConfigModule
  ]
})
export class TapConnectivitySettingsPageModule {}
