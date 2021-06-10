import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "connectivity",
    loadChildren: () =>
      import(
        `./tap-connectivity-settings-page/tap-connectivity-settings-page.module`
      ).then(m => m.TapConnectivitySettingsPageModule)
  },
  {
    path: "info",
    loadChildren: () =>
      import(`./tap-info-page/tap-info-page.module`).then(
        m => m.TapInfoPageModule
      )
  },
  {
    path: "login",
    loadChildren: () =>
      import(`./tap-login-page/tap-login-page.module`).then(
        m => m.TapLoginPageModule
      )
  },
  {
    path: "monitoring",
    loadChildren: () =>
      import(`./monitoring-page/monitoring-page.module`).then(
        m => m.MonitoringPageModule
      )
  },
  {
    path: "settings",
    loadChildren: () =>
      import(`./tap-config-page/tap-config-page.module`).then(
        m => m.TapConfigPageModule
      )
  },
  {
    path: "",
    redirectTo: "info",
    pathMatch: "full"
  }
];
