import { NgModule } from "@angular/core";
import {
  TapProtocolConfigurationModule,
  TaskManagerUiModule
} from "@iotize/ionic";
import { AppThemeModule } from "app-theme";
import { ProtocolConfigurationRoutingModule } from "./protocol-configuration-routing.module";
import { ProtocolConfigurationComponent } from "./protocol-configuration.component";

@NgModule({
  declarations: [ProtocolConfigurationComponent],
  imports: [
    AppThemeModule,
    ProtocolConfigurationRoutingModule,
    TapProtocolConfigurationModule,
    TaskManagerUiModule
  ]
})
export class ProtocolConfigurationModule {}
