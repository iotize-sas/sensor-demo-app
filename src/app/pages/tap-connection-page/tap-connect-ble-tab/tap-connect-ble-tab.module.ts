import { NgModule } from "@angular/core";
import { TapConnectBleTabComponent } from "./tap-connect-ble-tab.component";
import { RouterModule } from "@angular/router";
import { TapConnectBleModule } from "@iotize/ionic";
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
