import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TechDashboardComponent } from "./tech-dashboard.component";
import { TechDashboardChildrenRoutes } from "./tech-dashboard-routes";
import { DeviceAuthGuard } from "@iotize/ionic";

const routes: Routes = [
  {
    path: "",
    component: TechDashboardComponent,
    canActivate: [DeviceAuthGuard],
    data: {
      username: ["tech"]
    },

    children: TechDashboardChildrenRoutes
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechDashboardRoutingModule {}
