import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DeviceAuthGuard } from "@iotize/ionic";
import { TapSettingsPageComponent } from "./tap-settings-page.component";

const routes: Routes = [
  {
    path: "",
    component: TapSettingsPageComponent,
    canActivate: [DeviceAuthGuard],
    data: {
      username: ["admin", "supervisor"]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TapSettingsPageRoutingModule {}
