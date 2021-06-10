import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TapDevicePageComponent } from "./tap-device-page.component";
import { ConnectedTapResolver } from "@iotize/ionic";
import { routes as childrenRoutes } from "./tap-device-page-routing.routes";
import { TapDevicePageResolverService } from "./tap-device-page-resolver.service";

const baseRoutes = [];

const routes: Routes = [
  {
    path: "",
    component: TapDevicePageComponent,
    resolve: {
      currentTapData: TapDevicePageResolverService
    },
    data: {
      noTapRedirectUrl: false,
      allowNoProtocolTap: true
    },
    children: [...baseRoutes, ...childrenRoutes]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    // ConnectedTapResolver
  ],
  exports: [RouterModule]
})
export class TapDevicePageRoutingModule {}
