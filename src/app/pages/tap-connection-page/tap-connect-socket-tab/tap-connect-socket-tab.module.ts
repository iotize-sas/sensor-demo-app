import { NgModule } from "@angular/core";
import { TapConnectSocketTabComponent } from "./tap-connect-socket-tab.component";
import { RouterModule } from "@angular/router";
import {
  TapConnectSocketModule,
  TapConnectionStoreModule
} from "@iotize/ionic";
import { AppThemeModule } from "app-theme";
import { TapScannerWifiModule } from "@iotize/ionic";

@NgModule({
  declarations: [TapConnectSocketTabComponent],
  imports: [
    AppThemeModule,
    TapConnectSocketModule,
    TapScannerWifiModule,

    TapConnectionStoreModule,

    RouterModule.forChild([
      {
        path: "",
        component: TapConnectSocketTabComponent
      }
    ])
  ]
})
export class TapConnectSocketTabModule {}
