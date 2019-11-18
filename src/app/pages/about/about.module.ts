import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AboutComponent } from "./about.component";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: "",
        component: AboutComponent
      }
    ])
  ]
})
export class AboutModule {}
