import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProtocolConfigurationComponent } from "./protocol-configuration.component";

const routes: Routes = [
  {
    path: "",
    component: ProtocolConfigurationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProtocolConfigurationRoutingModule {}
