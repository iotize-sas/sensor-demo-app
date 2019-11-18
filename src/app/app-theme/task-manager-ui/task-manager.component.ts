import {
  Component,
  OnInit,
  Input,
  ContentChild,
  TemplateRef,
  Directive,
  ViewChild,
  AfterViewInit,
  ContentChildren,
  HostListener,
  EventEmitter,
  Output,
  ElementRef,
  Renderer2
} from "@angular/core";
import getDebugger from "src/app/logger";
import {
  TapResponseErrorCode,
  ResultCode,
  ResponseError
} from "@iotize/device-client.js/client/api/response";
import { TapClientError } from "@iotize/device-client.js/client/impl";
import { TaskManagerService, TaskManager } from "../task-manager.service";
const debug = getDebugger("TaskManager");

@Directive({
  selector: "[app-task-manager-action-cancel]"
})
export class TaskManagerActionCancelDirective implements AfterViewInit {
  @Output() onClick = new EventEmitter<void>();

  constructor(
    readonly elementRef: ElementRef,
    private readonly renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    // this.tpl.elementRef.nativeElement.click = () => {
    //   console.info('ELEMENT CLICK');
    // }
  }

  // disable(value: boolean) {
  //   // this.elementRef.
  // }

  @HostListener("click") onClickListener() {
    debug("app-task-manager-action-cancel clicked");
    this.onClick.emit();
  }
}

@Directive({
  selector: "[app-task-manager-action-exec]"
})
export class TaskManagerActionExecDirective implements AfterViewInit {
  @Output() onClick = new EventEmitter<void>();

  constructor() // public tpl: TemplateRef<any>
  {}

  ngAfterViewInit(): void {
    // this.tpl.elementRef.nativeElement.click = () => {
    //   console.info('ELEMENT CLICK');
    // }
  }

  @HostListener("click") onClickListener() {
    this.onClick.emit();
  }
}

@Component({
  selector: "app-task-manager-running",
  template: `
    <ng-content></ng-content>
  `
})
export class TaskManagerRunningComponent {
  /** Template inside the MatTab view that contains an `<ng-content>`. */
  @ViewChild(TemplateRef, {}) _implicitContent: TemplateRef<any>;

  @Input() context: any;

  constructor(public taskManager: TaskManagerService) {}

  ngOnInit(): void {}
}

@Component({
  selector: "app-task-manager-delayed",
  template: `
    <ng-content></ng-content>
  `
})
export class TaskManagerDelayedComponent {
  /** Template inside the MatTab view that contains an `<ng-content>`. */
  @ViewChild(TemplateRef, {}) _implicitContent: TemplateRef<any>;

  @Input() context: any;

  constructor(public taskManager: TaskManagerService) {}

  ngOnInit(): void {}

  cancelTask() {
    console.info("Cancel task click!!!");
  }
}

@Component({
  selector: "app-task-manager-action",
  template: `
    <ng-content></ng-content>
  `
})
export class TaskManagerActionComponent implements OnInit, AfterViewInit {
  @Input() context: any;

  /** Template inside the MatTab view that contains an `<ng-content>`. */
  @ViewChild(TemplateRef, {}) _implicitContent: TemplateRef<any>;

  // @ContentChildren(TaskManagerActionExecDirective) execButton!: TaskManagerActionExecDirective;

  constructor(public taskManager: TaskManagerService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  performTask() {
    console.info("Cancel task click!!!");
  }
}

@Component({
  selector: "app-task-manager",
  templateUrl: "./task-manager.component.html",
  styleUrls: ["./task-manager.component.scss"]
})
export class TaskManagerComponent implements OnInit, AfterViewInit {
  taskContainer: TaskManager.TaskContainer;

  @Input() set task(task: TaskManager.TaskContainer | string) {
    if (typeof task === "string") {
      task = this.taskManager.container(task);
    }
    debug("set task ", task ? task.task.id : "undefined");
    this.taskContainer = task;
  }

  get taskId() {
    return this.taskContainer.task.id;
  }

  @ContentChild(TaskManagerActionCancelDirective, {})
  cancelDirective?: TaskManagerActionCancelDirective;
  @ContentChild(TaskManagerActionExecDirective, {})
  execDirective?: TaskManagerActionCancelDirective;

  // @ContentChild(TaskManagerActionComponent, {}) actionComponent: TaskManagerActionComponent;

  constructor(public taskManager: TaskManagerService) {}

  get loading(): boolean {
    return false;
  }

  get taskState() {
    return this.taskContainer ? this.taskContainer.meta.state : undefined;
  }

  get actionTemplateContext() {
    let context = this._createContext();
    if ("execTask" in context) {
      context["execTask"] = (...context: any[]) => {
        this.execTask(context);
      };
    }
    return { $implicit: context };
  }

  get delayedTemplateContext() {
    let context = this._createContext();
    if ("execTask" in this) {
      context["execTask"] = () => {
        if (this.taskManager.hasTask(this.taskId)) {
          this.taskManager.cancel(this.taskId);
        }
      };
    }
    return { $implicit: context };
  }

  private _createContext(): any {
    return this;
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    if (this.cancelDirective) {
      this.cancelDirective.onClick.subscribe(() => {
        this.cancelTask();
      });
    } else {
      debug("cancel button is not set yet");
    }
    if (this.execDirective) {
      this.execDirective.onClick.subscribe(() => {
        this.execTask();
      });
    }
  }

  ngOnDestroy() {
    debug(this.taskId, "component ngOnDestroy");
    this.cancelTask();
  }

  cancelTask() {
    debug("cancelTask clicked!");
    if (this.taskManager.hasTask(this.taskId)) {
      this.taskManager.cancel(this.taskId);
    } else {
      debug("cannot cancel task ", this.taskId, "it does not exist");
    }
  }

  explainDelayReason() {
    let err = this.taskContainer.meta.error;
    if (err) {
      switch (err["code"]) {
        case TapResponseErrorCode:
          switch ((err as ResponseError).response.codeRet()) {
            case ResultCode.IOTIZE_401_UNAUTHORIZED:
              return "Waiting for user login";
            default:
              return "Unknown reason";
          }
        case TapClientError.Code.NotConnectedError:
        case "NfcTagLostError":
        case "NfcNotConnectedError":
          return "Waiting for Tap reconnection";
        default:
          return "Unknown reason";
      }
    }
  }

  execTask(context?: any) {
    debug("execTask ", this.taskId);
    if (!this.taskManager.hasTask(this.taskId)) {
      this.taskManager.addTaskContainer(this.taskContainer);
    }
    // this.execDirective.disable(true);
    this.taskManager.exec(this.taskId, context).subscribe({
      error: err => {
        console.warn(err);
        // this.execDirective.disable(false);
      },
      complete: () => {
        console.warn("OK COMPLETED");
        // this.execDirective.disable(false);
      }
    });
  }
}
