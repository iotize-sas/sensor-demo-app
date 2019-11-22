import { NgModule } from "@angular/core";
import { AppThemeModule } from "app-theme";
import { PeripheralRoutingModule } from "./peripheral-routing.module";
import { PeripheralComponent } from "./peripheral.component";
import { TapMonitoringModule } from "@iotize/ionic";

@NgModule({
  declarations: [PeripheralComponent],
  imports: [AppThemeModule, PeripheralRoutingModule, TapMonitoringModule]
})
export class AdminPeripheralModule {}
