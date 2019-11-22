import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MySensorsComponent } from "./my-sensors.component";
import { MySensorsChildrenRoutes } from "./my-sensors-routes";

const routes: Routes = [
  {
    path: "",
    component: MySensorsComponent,

    children: MySensorsChildrenRoutes
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MySensorsRoutingModule {}
