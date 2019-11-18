import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TapConnectNfcTabComponent } from "./tap-connect-nfc-tab.component";
import { TapScannerNfcModule } from "@iotize/ionic";
import { AppThemeModule } from "app-theme";

@NgModule({
  declarations: [TapConnectNfcTabComponent],
  imports: [
    AppThemeModule,
    TapScannerNfcModule,
    RouterModule.forChild([
      {
        path: "",
        component: TapConnectNfcTabComponent
      }
    ])
  ]
})
export class TapConnectNfcTabModule {}
