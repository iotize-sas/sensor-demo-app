import { NgModule } from "@angular/core";
import { AppThemeModule } from "app-theme";
import { AnonymousDashboardRoutingModule } from "./anonymous-dashboard-routing.module";
import { AnonymousDashboardComponent } from "./anonymous-dashboard.component";
import { TapMonitoringModule } from "@iotize/ionic/monitoring";

@NgModule({
  declarations: [AnonymousDashboardComponent],
  imports: [
    AppThemeModule,
    AnonymousDashboardRoutingModule,
    TapMonitoringModule
  ]
})
export class AnonymousDashboardModule {}
