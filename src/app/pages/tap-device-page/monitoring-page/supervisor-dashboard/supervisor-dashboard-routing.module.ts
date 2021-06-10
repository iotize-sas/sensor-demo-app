import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SupervisorDashboardComponent } from "./supervisor-dashboard.component";
import { SupervisorDashboardChildrenRoutes } from "./supervisor-dashboard-routes";
import { DeviceAuthGuard } from "@iotize/ionic/auth";

const routes: Routes = [
  {
    path: "",
    component: SupervisorDashboardComponent,
    canActivate: [DeviceAuthGuard],
    data: {
      username: ["supervisor"]
    },

    children: SupervisorDashboardChildrenRoutes
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupervisorDashboardRoutingModule {}
