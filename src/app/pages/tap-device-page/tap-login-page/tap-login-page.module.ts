import { NgModule } from "@angular/core";
import { AppThemeModule } from "app-theme";
import { TapLoginPageRoutingModule } from "./tap-login-page-routing.module";
import { TapLoginPageComponent } from "./tap-login-page.component";
import { TapAuthModule } from "@iotize/ionic";

@NgModule({
  declarations: [TapLoginPageComponent],
  imports: [AppThemeModule, TapLoginPageRoutingModule, TapAuthModule]
})
export class TapLoginPageModule {}
