import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MonitoringPageComponent } from "./monitoring-page.component";
import { Routes } from "@angular/router";
import { monitoringRoutes } from "./monitoring-page-routes";
import {
  CanActivateDashboardService,
  CanDeactivateDashboardService
} from "app-lib";

export const routes: Routes = [
  {
    path: "",
    component: MonitoringPageComponent,
    children: monitoringRoutes,
    canActivate: [CanActivateDashboardService],
    canDeactivate: [CanDeactivateDashboardService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoringPageRoutingModule {}
