import { NgModule } from "@angular/core";
import { AppThemeModule } from "app-theme";
import { TapInfoPageRoutingModule } from "./tap-info-page-routing.module";
import { TapInfoPageComponent } from "./tap-info-page.component";
import { TapConfigModule } from "@iotize/ionic";

@NgModule({
  declarations: [TapInfoPageComponent],
  imports: [AppThemeModule, TapInfoPageRoutingModule, TapConfigModule]
})
export class TapInfoPageModule {}
