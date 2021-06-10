import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DeviceAuthGuard } from "@iotize/ionic/auth";
import { TapConfigPageComponent } from "./tap-config-page.component";

const routes: Routes = [
  {
    path: "",
    component: TapConfigPageComponent,
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
export class TapConfigPageRoutingModule {}
