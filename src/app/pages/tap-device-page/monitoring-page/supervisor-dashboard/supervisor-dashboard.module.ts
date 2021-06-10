import { NgModule } from "@angular/core";
import { AppThemeModule } from "app-theme";
import { SupervisorDashboardRoutingModule } from "./supervisor-dashboard-routing.module";
import { SupervisorDashboardComponent } from "./supervisor-dashboard.component";
import { TapMonitoringModule } from "@iotize/ionic/monitoring";

@NgModule({
  declarations: [SupervisorDashboardComponent],
  imports: [
    AppThemeModule,
    SupervisorDashboardRoutingModule,
    TapMonitoringModule
  ]
})
export class SupervisorDashboardModule {}
