import { NgModule } from "@angular/core";
import { TapConnectComponent } from "./tap-connect.component";
import { RouterModule } from "@angular/router";
import { AppThemeModule } from "app-theme";

@NgModule({
  declarations: [TapConnectComponent],
  imports: [
    AppThemeModule,
    RouterModule.forChild([
      {
        path: "",
        component: TapConnectComponent,
        children: [
          {
            path: "",
            redirectTo: "mqtt",
            pathMatch: "full"
          },
          {
            path: "ble",
            loadChildren:
              "./tap-connect-ble-tab/tap-connect-ble-tab.module#TapConnectBleTabModule"
          },
          {
            path: "nfc",
            loadChildren:
              "./tap-connect-nfc-tab/tap-connect-nfc-tab.module#TapConnectNfcTabModule"
          },
          {
            path: "socket",
            loadChildren:
              "./tap-connect-socket-tab/tap-connect-socket-tab.module#TapConnectSocketTabModule"
          },
          {
            path: "mqtt",
            loadChildren:
              "./tap-connect-mqtt-tab/tap-connect-mqtt-tab.module#TapConnectMqttTabModule"
          }
        ]
      }
    ])
  ]
})
export class TapConnectModule {}
