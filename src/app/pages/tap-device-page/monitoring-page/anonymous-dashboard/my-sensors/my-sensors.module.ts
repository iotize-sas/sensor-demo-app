import { NgModule } from "@angular/core";
import { AppThemeModule } from "app-theme";
import { MySensorsRoutingModule } from "./my-sensors-routing.module";
import { MySensorsComponent } from "./my-sensors.component";
import { TapMonitoringModule } from "@iotize/ionic";

@NgModule({
  declarations: [MySensorsComponent],
  imports: [AppThemeModule, MySensorsRoutingModule, TapMonitoringModule]
})
export class AnonymousMySensorsModule {}
