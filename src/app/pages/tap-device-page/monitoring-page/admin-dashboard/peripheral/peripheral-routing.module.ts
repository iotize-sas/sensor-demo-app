import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PeripheralComponent } from "./peripheral.component";
import { PeripheralChildrenRoutes } from "./peripheral-routes";
import { DeviceAuthGuard } from "@iotize/ionic";

const routes: Routes = [
  {
    path: "",
    component: PeripheralComponent,
    canActivate: [DeviceAuthGuard],
    data: {
      username: ["admin"]
    },

    children: PeripheralChildrenRoutes
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeripheralRoutingModule {}
