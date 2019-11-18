import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { MonitoringPageComponent } from "./monitoring-page.component";
import { MonitoringPageRoutingModule } from "./monitoring-page-routing.module";

@NgModule({
  declarations: [MonitoringPageComponent],
  imports: [MonitoringPageRoutingModule, IonicModule]
})
export class MonitoringPageModule {}
