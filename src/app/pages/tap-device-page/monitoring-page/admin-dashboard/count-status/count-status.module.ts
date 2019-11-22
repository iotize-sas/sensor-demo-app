import { NgModule } from "@angular/core";
import { AppThemeModule } from "app-theme";
import { CountStatusRoutingModule } from "./count-status-routing.module";
import { CountStatusComponent } from "./count-status.component";
import { TapMonitoringModule } from "@iotize/ionic";

@NgModule({
  declarations: [CountStatusComponent],
  imports: [AppThemeModule, CountStatusRoutingModule, TapMonitoringModule]
})
export class AdminCountStatusModule {}
