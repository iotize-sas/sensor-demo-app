import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TapLoginPageComponent } from "./tap-login-page.component";

const routes: Routes = [
  {
    path: "",
    component: TapLoginPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TapLoginPageRoutingModule {}
