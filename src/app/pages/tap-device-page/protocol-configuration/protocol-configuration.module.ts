import { NgModule } from "@angular/core";
import { TaskManagerUiModule } from "@iotize/ionic";
import { TapTargetS3PModule } from "@iotize/ionic/target/s3p";
import { TapTargetSerialModule } from "@iotize/ionic/target/serial";
import { TapTargetModbusModule } from "@iotize/ionic/target/modbus";
import { TapConfigModule } from "@iotize/ionic/config";
import { AppThemeModule } from "app-theme";
import { ProtocolConfigurationRoutingModule } from "./protocol-configuration-routing.module";
import { ProtocolConfigurationComponent } from "./protocol-configuration.component";

@NgModule({
  declarations: [ProtocolConfigurationComponent],
  imports: [
    AppThemeModule,
    ProtocolConfigurationRoutingModule,
    TapTargetS3PModule,
    TapTargetSerialModule,
    TapTargetModbusModule,
    TapConfigModule,
    TaskManagerUiModule
  ]
})
export class ProtocolConfigurationModule {}
