import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { TapDeviceAngularModule } from "@iotize/ionic";

import {
  TaskManagerActionCancelDirective,
  TaskManagerActionComponent,
  TaskManagerActionExecDirective,
  TaskManagerComponent,
  TaskManagerDelayedComponent,
  TaskManagerRunningComponent
} from "./task-manager.component";

const EXPORTS = [
  TaskManagerComponent,
  TaskManagerActionCancelDirective,
  TaskManagerActionExecDirective,
  TaskManagerDelayedComponent,
  TaskManagerActionComponent,
  TaskManagerRunningComponent
];

@NgModule({
  declarations: EXPORTS,
  exports: EXPORTS,
  imports: [CommonModule, IonicModule, TapDeviceAngularModule]
})
export class TaskManagerUiModule {}
