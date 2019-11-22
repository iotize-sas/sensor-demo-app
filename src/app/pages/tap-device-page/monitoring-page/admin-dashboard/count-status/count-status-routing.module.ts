import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CountStatusComponent } from "./count-status.component";
import { CountStatusChildrenRoutes } from "./count-status-routes";
import { DeviceAuthGuard } from "@iotize/ionic";

const routes: Routes = [
  {
    path: "",
    component: CountStatusComponent,
    canActivate: [DeviceAuthGuard],
    data: {
      username: ["admin"]
    },

    children: CountStatusChildrenRoutes
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountStatusRoutingModule {}
