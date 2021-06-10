import { NgModule } from "@angular/core";
import { TapConfigModule } from "@iotize/ionic/config";
import { AppThemeModule } from "app-theme";
import { TapConfigPageRoutingModule } from "./tap-config-page-routing.module";
import { TapConfigPageComponent } from "./tap-config-page.component";

@NgModule({
  declarations: [TapConfigPageComponent],
  imports: [AppThemeModule, TapConfigModule, TapConfigPageRoutingModule]
})
export class TapConfigPageModule {}
