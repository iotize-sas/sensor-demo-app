import { NgModule } from "@angular/core";
import { AppThemeModule } from "app-theme";
import { AdminDashboardRoutingModule } from "./admin-dashboard-routing.module";
import { AdminDashboardComponent } from "./admin-dashboard.component";
import { TapMonitoringModule } from "@iotize/ionic";

@NgModule({
  declarations: [AdminDashboardComponent],
  imports: [AppThemeModule, AdminDashboardRoutingModule, TapMonitoringModule]
})
export class AdminDashboardModule {}
