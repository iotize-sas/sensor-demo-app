import { NgModule } from "@angular/core";
import { AppThemeModule } from "app-theme";
import { TechDashboardRoutingModule } from "./tech-dashboard-routing.module";
import { TechDashboardComponent } from "./tech-dashboard.component";
import { TapMonitoringModule } from "@iotize/ionic";

@NgModule({
  declarations: [TechDashboardComponent],
  imports: [AppThemeModule, TechDashboardRoutingModule, TapMonitoringModule]
})
export class TechDashboardModule {}
