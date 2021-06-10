import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "about",
    loadChildren: () =>
      import(`./pages/about-page/about-page.module`).then(
        m => m.AboutPageModule
      )
  },
  {
    path: "connect",
    loadChildren: () =>
      import(`./pages/tap-connection-page/tap-connection-page.module`).then(
        m => m.TapConnectionPageModule
      )
  },
  {
    path: "device",
    loadChildren: () =>
      import(`./pages/tap-device-page/tap-device-page.module`).then(
        m => m.TapDevicePageModule
      )
  },
  {
    pathMatch: "full",
    path: "",
    redirectTo: "/connect"
  },
  {
    path: "**",
    loadChildren: () =>
      import(`./pages/not-found-page/not-found-page.module`).then(
        m => m.NotFoundPageModule
      )
  }
];
