import { DeviceAuthGuard } from "@iotize/ionic/auth";

export const monitoringRoutes = [
  {
    path: "anonymous",
    loadChildren:
      "src/app/pages/tap-device-page/monitoring-page/anonymous-dashboard/anonymous-dashboard.module#AnonymousDashboardModule"
  },
  {
    path: "admin",
    loadChildren:
      "src/app/pages/tap-device-page/monitoring-page/admin-dashboard/admin-dashboard.module#AdminDashboardModule"
  },
  {
    path: "tech",
    loadChildren:
      "src/app/pages/tap-device-page/monitoring-page/tech-dashboard/tech-dashboard.module#TechDashboardModule"
  }
];
