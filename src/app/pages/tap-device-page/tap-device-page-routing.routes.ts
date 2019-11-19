import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "info",
    loadChildren:
      "src/app/pages/tap-device-page/tap-info-page/tap-info-page.module#TapInfoPageModule"
  },
  {
    path: "settings",
    loadChildren:
      "src/app/pages/tap-device-page/tap-settings-page/tap-settings-page.module#TapSettingsPageModule"
  },
  {
    path: "login",
    loadChildren:
      "src/app/pages/tap-device-page/tap-login-page/tap-login-page.module#TapLoginPageModule"
  },
  {
    path: "monitoring",
    loadChildren:
      "src/app/pages/tap-device-page/monitoring-page/monitoring-page.module#MonitoringPageModule"
  },
  {
    path: "",
    redirectTo: "monitoring",
    pathMatch: "full"
  }
];
