import { NgModule } from "@angular/core";
import { TapConnectBleTabComponent } from "./connect-ble.component";
import { RouterModule } from "@angular/router";
import { TapConnectBleModule, TapDeviceAngularModule } from "@iotize/ionic";
import { AppThemeModule } from "app-theme";

@NgModule({
  declarations: [TapConnectBleTabComponent],
  imports: [
    AppThemeModule,
    TapConnectBleModule,
    RouterModule.forChild([
      {
        path: "",
        component: TapConnectBleTabComponent
      }
    ])
  ]
})
export class TapConnectBleTabModule {}
