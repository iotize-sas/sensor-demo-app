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
import { TapControlMenuComponent } from "./tap-control-menu/tap-control-menu.component";
import { TaskManagerUiModule } from "@iotize/ionic";
import { TapAuthModule } from "@iotize/ionic/auth";
import { NotificationsComponent } from "./notifications/notifications.component";

@NgModule({
  declarations: [
    FeedbackComponent,
    ErrorFeedbackComponent,
    ProgressBarStepComponent,
    ConnectionStateFeedbackComponent,
    NavigationProgressBarComponent,
    SideMenuComponent,
    TapControlMenuComponent,
    NotificationsComponent
  ],
  exports: [
    CommonModule,
    IonicModule,
    FeedbackComponent,
    ErrorFeedbackComponent,
    ProgressBarStepComponent,
    ConnectionStateFeedbackComponent,
    NavigationProgressBarComponent,
    SideMenuComponent,
    TapControlMenuComponent,
    NotificationsComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    TaskManagerUiModule,
    TapAuthModule
  ],
  entryComponents: [NotificationsComponent]
})
export class AppThemeModule {}
