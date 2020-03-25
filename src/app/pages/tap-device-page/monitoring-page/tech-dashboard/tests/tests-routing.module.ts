import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TestsComponent } from "./tests.component";
import { TestsChildrenRoutes } from "./tests-routes";
import { DeviceAuthGuard } from "@iotize/ionic/auth";

const routes: Routes = [
  {
    path: "",
    component: TestsComponent,
    canActivate: [DeviceAuthGuard],
    data: {
      username: ["tech"]
    },

    children: TestsChildrenRoutes
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestsRoutingModule {}
