import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminDashboardComponent } from "./admin-dashboard.component";
import { AdminDashboardChildrenRoutes } from "./admin-dashboard-routes";
import { DeviceAuthGuard } from "@iotize/ionic";

const routes: Routes = [
  {
    path: "",
    component: AdminDashboardComponent,
    canActivate: [DeviceAuthGuard],
    data: {
      username: ["admin"]
    },

    children: AdminDashboardChildrenRoutes
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminDashboardRoutingModule {}
