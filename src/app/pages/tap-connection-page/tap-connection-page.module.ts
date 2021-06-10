import { NgModule } from "@angular/core";
import { TapConnectionPageComponent } from "./tap-connection-page.component";
import { RouterModule } from "@angular/router";
import { AppThemeModule } from "app-theme";

@NgModule({
  declarations: [TapConnectionPageComponent],
  imports: [
    AppThemeModule,
    RouterModule.forChild([
      {
        path: "",
        component: TapConnectionPageComponent,
        children: [
          {
            path: "",
            redirectTo: "ble",
            pathMatch: "full"
          },
          {
            path: "ble",
            loadChildren: () =>
              import("./tap-connect-ble-tab/tap-connect-ble-tab.module").then(
                m => m.TapConnectBleTabModule
              )
          },
          {
            path: "nfc",
            loadChildren: () =>
              import("./tap-connect-nfc-tab/tap-connect-nfc-tab.module").then(
                m => m.TapConnectNfcTabModule
              )
          },
          {
            path: "socket",
            loadChildren: () =>
              import(
                "./tap-connect-socket-tab/tap-connect-socket-tab.module"
              ).then(m => m.TapConnectSocketTabModule)
          },
          {
            path: "mqtt",
            loadChildren: () =>
              import("./tap-connect-mqtt-tab/tap-connect-mqtt-tab.module").then(
                m => m.TapConnectMqttTabModule
              )
          }
        ]
      }
    ])
  ]
})
export class TapConnectionPageModule {}
