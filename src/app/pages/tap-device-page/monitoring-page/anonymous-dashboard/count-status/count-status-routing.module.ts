import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CountStatusComponent } from "./count-status.component";
import { CountStatusChildrenRoutes } from "./count-status-routes";

const routes: Routes = [
  {
    path: "",
    component: CountStatusComponent,

    children: CountStatusChildrenRoutes
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountStatusRoutingModule {}
