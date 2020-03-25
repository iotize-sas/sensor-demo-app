import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TapConnectivitySettingsPageComponent } from "./tap-connectivity-settings-page.component";

const routes: Routes = [
  {
    path: "",
    component: TapConnectivitySettingsPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TapConnectivitySettingsPageRoutingModule {}
