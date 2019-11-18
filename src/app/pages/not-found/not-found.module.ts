import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotFoundComponent } from "./not-found.component";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: "",
        component: NotFoundComponent
      }
    ])
  ]
})
export class NotFoundModule {}
