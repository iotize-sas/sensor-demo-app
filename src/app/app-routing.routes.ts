import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "device",
    loadChildren:
      "src/app/pages/tap-device-page/tap-device-page.module#TapDevicePageModule"
  },
  {
    path: "connect",
    loadChildren:
      "src/app/pages/tap-connect/tap-connect.module#TapConnectModule"
  },
  {
    pathMatch: "full",
    path: "",
    redirectTo: "/connect"
  },
  {
    path: "**",
    loadChildren: "src/app/pages/not-found/not-found.module#NotFoundModule"
  }
];
