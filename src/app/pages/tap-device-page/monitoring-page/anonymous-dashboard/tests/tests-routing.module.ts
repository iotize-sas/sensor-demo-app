import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TestsComponent } from "./tests.component";
import { TestsChildrenRoutes } from "./tests-routes";

const routes: Routes = [
  {
    path: "",
    component: TestsComponent,

    children: TestsChildrenRoutes
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestsRoutingModule {}
