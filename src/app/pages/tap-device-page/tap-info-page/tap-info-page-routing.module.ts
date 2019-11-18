import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TapInfoPageComponent } from "./tap-info-page.component";

const routes: Routes = [
  {
    path: "",
    component: TapInfoPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TapInfoPageRoutingModule {}
