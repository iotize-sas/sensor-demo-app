import { NgModule } from "@angular/core";
import { TapConfigModule } from "@iotize/ionic";
import { AppThemeModule } from "app-theme";
import { TapSettingsPageRoutingModule } from "./tap-settings-page-routing.module";
import { TapSettingsPageComponent } from "./tap-settings-page.component";

@NgModule({
  declarations: [TapSettingsPageComponent],
  imports: [AppThemeModule, TapConfigModule, TapSettingsPageRoutingModule]
})
export class TapSettingsPageModule {}
