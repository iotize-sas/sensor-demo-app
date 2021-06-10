import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AboutPageComponent } from "./about-page.component";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [AboutPageComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: "",
        component: AboutPageComponent
      }
    ])
  ]
})
export class AboutPageModule {}
