import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FeedbackComponent } from "./feedback/feedback.component";
import { ErrorFeedbackComponent } from "./error-feedback/error-feedback.component";
import { IonicModule } from "@ionic/angular";
import { ProgressBarStepComponent } from "./progress-bar-step/progress-bar-step.component";
import { ConnectionStateFeedbackComponent } from "./connection-state-feedback/connection-state-feedback.component";
import { NavigationProgressBarComponent } from "./navigation-progress-bar/navigation-progress-bar.component";
import { SideMenuComponent } from "./side-menu/side-menu.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    FeedbackComponent,
    ErrorFeedbackComponent,
    ProgressBarStepComponent,
    ConnectionStateFeedbackComponent,
    NavigationProgressBarComponent,
    SideMenuComponent
  ],
  exports: [
    CommonModule,
    IonicModule,
    FeedbackComponent,
    ErrorFeedbackComponent,
    ProgressBarStepComponent,
    ConnectionStateFeedbackComponent,
    NavigationProgressBarComponent,
    SideMenuComponent
  ],
  providers: [],
  imports: [CommonModule, IonicModule, RouterModule]
})
export class AppThemeModule {}
