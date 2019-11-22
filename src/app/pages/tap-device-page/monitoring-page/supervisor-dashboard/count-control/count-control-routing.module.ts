import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CountControlComponent } from "./count-control.component";
import { CountControlChildrenRoutes } from "./count-control-routes";
import { DeviceAuthGuard } from "@iotize/ionic";

const routes: Routes = [
  {
    path: "",
    component: CountControlComponent,
    canActivate: [DeviceAuthGuard],
    data: {
      username: ["supervisor"]
    },

    children: CountControlChildrenRoutes
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountControlRoutingModule {}
