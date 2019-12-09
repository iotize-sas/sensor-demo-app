import { Routes } from "@angular/router";

export const AdminDashboardChildrenRoutes: Routes = [
  {
    path: "count-status",
    loadChildren:
      "src/app/pages/tap-device-page/monitoring-page/admin-dashboard/count-status/count-status.module#AdminCountStatusModule"
  },

  {
    path: "my-sensors",
    loadChildren:
      "src/app/pages/tap-device-page/monitoring-page/admin-dashboard/my-sensors/my-sensors.module#AdminMySensorsModule"
  },

  {
    path: "count-control",
    loadChildren:
      "src/app/pages/tap-device-page/monitoring-page/admin-dashboard/count-control/count-control.module#AdminCountControlModule"
  },

  {
    path: "",
    redirectTo: "count-status",
    pathMatch: "full"
  }
];
