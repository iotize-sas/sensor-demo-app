import { NgModule } from "@angular/core";
import { AppThemeModule } from "app-theme";
import { CountControlRoutingModule } from "./count-control-routing.module";
import { CountControlComponent } from "./count-control.component";
import { TapMonitoringModule } from "@iotize/ionic";

@NgModule({
  declarations: [CountControlComponent],
  imports: [AppThemeModule, CountControlRoutingModule, TapMonitoringModule]
})
export class TechCountControlModule {}
