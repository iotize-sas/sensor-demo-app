import { NgModule } from "@angular/core";
import { AppThemeModule } from "app-theme";
import { TestsRoutingModule } from "./tests-routing.module";
import { TestsComponent } from "./tests.component";
import { TapMonitoringModule } from "@iotize/ionic/monitoring";

@NgModule({
  declarations: [TestsComponent],
  imports: [AppThemeModule, TestsRoutingModule, TapMonitoringModule]
})
export class AdminTestsModule {}
