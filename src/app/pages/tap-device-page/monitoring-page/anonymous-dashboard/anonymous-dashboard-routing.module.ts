import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AnonymousDashboardComponent } from "./anonymous-dashboard.component";
import { AnonymousDashboardChildrenRoutes } from "./anonymous-dashboard-routes";

const routes: Routes = [
  {
    path: "",
    component: AnonymousDashboardComponent,

    children: AnonymousDashboardChildrenRoutes
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnonymousDashboardRoutingModule {}
