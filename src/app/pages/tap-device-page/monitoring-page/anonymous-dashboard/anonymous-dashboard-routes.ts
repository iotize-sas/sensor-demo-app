import { Routes } from "@angular/router";

export const AnonymousDashboardChildrenRoutes: Routes = [
  {
    path: "count-status",
    loadChildren:
      "src/app/pages/tap-device-page/monitoring-page/anonymous-dashboard/count-status/count-status.module#AnonymousCountStatusModule"
  },

  {
    path: "my-sensors",
    loadChildren:
      "src/app/pages/tap-device-page/monitoring-page/anonymous-dashboard/my-sensors/my-sensors.module#AnonymousMySensorsModule"
  },

  {
    path: "count-control",
    loadChildren:
      "src/app/pages/tap-device-page/monitoring-page/anonymous-dashboard/count-control/count-control.module#AnonymousCountControlModule"
  },

  {
    path: "",
    redirectTo: "count-status",
    pathMatch: "full"
  }
];
