import { Routes } from "@angular/router";

export const TechDashboardChildrenRoutes: Routes = [
  {
    path: "count-status",
    loadChildren:
      "src/app/pages/tap-device-page/monitoring-page/tech-dashboard/count-status/count-status.module#TechCountStatusModule"
  },

  {
    path: "my-sensors",
    loadChildren:
      "src/app/pages/tap-device-page/monitoring-page/tech-dashboard/my-sensors/my-sensors.module#TechMySensorsModule"
  },

  {
    path: "count-control",
    loadChildren:
      "src/app/pages/tap-device-page/monitoring-page/tech-dashboard/count-control/count-control.module#TechCountControlModule"
  },

  {
    path: "",
    redirectTo: "count-status",
    pathMatch: "full"
  }
];
