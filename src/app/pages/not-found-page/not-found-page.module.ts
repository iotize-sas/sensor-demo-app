import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotFoundPageComponent } from "./not-found-page.component";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [NotFoundPageComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: "",
        component: NotFoundPageComponent
      }
    ])
  ]
})
export class NotFoundPageModule {}
