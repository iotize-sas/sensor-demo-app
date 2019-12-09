import { Routes } from "@angular/router";

export const SupervisorDashboardChildrenRoutes: Routes = [
  {
    path: "count-status",
    loadChildren:
      "src/app/pages/tap-device-page/monitoring-page/supervisor-dashboard/count-status/count-status.module#SupervisorCountStatusModule"
  },

  {
    path: "my-sensors",
    loadChildren:
      "src/app/pages/tap-device-page/monitoring-page/supervisor-dashboard/my-sensors/my-sensors.module#SupervisorMySensorsModule"
  },

  {
    path: "count-control",
    loadChildren:
      "src/app/pages/tap-device-page/monitoring-page/supervisor-dashboard/count-control/count-control.module#SupervisorCountControlModule"
  },

  {
    path: "",
    redirectTo: "count-status",
    pathMatch: "full"
  }
];
