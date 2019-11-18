import { Injectable } from "@angular/core";
import {
  ResponseError,
  ResultCode,
  TapResponseErrorCode
} from "@iotize/device-client.js/client/api/response";
import { TapClientError } from "@iotize/device-client.js/client/impl";
import { Observable, Subject, Subscriber, throwError } from "rxjs";
import { share } from "rxjs/operators";
import getDebugger from "src/app/logger";

const debug = getDebugger("TaskManager");

export namespace TaskManager {
  export type TaskState = "pending" | "running" | "delayed" | "done";

  export type Event =
    | BeforeTaskEvent
    | AfterTaskEvent
    | CancelTaskEvent
    | ErrorTaskEvent;

  export interface BeforeTaskEvent {
    type: "BEFORE_TASK";
    task: Task;
  }
  export interface AfterTaskEvent {
    type: "AFTER_TASK";
    task: Task;
    result: any;
  }
  export interface CancelTaskEvent {
    type: "CANCEL_TASK";
    task: Task;
  }

  export interface ErrorTaskEvent {
    type: "ERROR_TASK";
    task: Task;
    error: Error;
    delayed: boolean;
  }

  export interface Task {
    id: string;

    priority?: number;

    exec(context?: any): Promise<any>;

    cancel?(): any;

    // onError?(err: Error, container: TaskContainer): void;

    [key: string]: any;
  }

  export interface TaskContainer {
    task: TaskManager.Task;
    events: Subject<TaskManager.Event>;
    meta: {
      state: TaskManager.TaskState;
      result?: any;
      error?: Error;
      context?: any;
    };
  }
}

type TaskContainer = TaskManager.TaskContainer;

@Injectable({
  providedIn: "root"
})
export class TaskManagerService {
  private _tasks: TaskContainer[];

  private _events: Subject<TaskManager.Event>;

  public get events() {
    return this._events.asObservable();
  }

  public get tasks(): TaskManager.Task[] {
    return this._tasks.map(container => container.task);
  }

  constructor() {
    debug("new instance!");
    this._tasks = [];
    this._events = new Subject();
  }

  createTask(
    task: TaskManager.Task,
    options: {
      position?: number;
    } = {}
  ): TaskManager.TaskContainer {
    if (this.hasTask(task.id)) {
      this.clearTask(task.id);
    }
    let taskContainer: TaskContainer = {
      task: task,
      meta: {
        state: "pending"
      },
      events: new Subject<TaskManager.Event>()
    };
    let position: number;
    if (options.position !== undefined) {
      this._tasks.splice(options.position, 0, taskContainer);
      position = options.position;
    } else {
      let newLength = this._tasks.push(taskContainer);
      position = newLength - 1;
    }
    debug("createTask", task.id, "position", position);
    return taskContainer;
  }

  hasTask(id: string): boolean {
    return this.getTaskPosition(id) !== -1;
  }

  task(id: string): TaskManager.Task | undefined {
    let container = this.container(id);
    if (container) {
      return container.task;
    }
    return undefined;
  }

  container(id: string): TaskContainer | undefined {
    let index = this.getTaskPosition(id);
    if (index >= 0) {
      return this._tasks[index];
    }
    return undefined;
  }

  cancel(id: string) {
    let index = this.getTaskPosition(id);
    if (index >= 0) {
      this._cancel(this._tasks[index]);
    } else {
      debug("task ", id, "does not exist. Cannot cancel");
    }
  }

  taskMeta(id: string) {
    let container = this.container(id);
    if (container) {
      return container.meta;
    }
    return undefined;
  }

  addTaskContainer(container: TaskManager.TaskContainer) {
    this._tasks.push(container);
  }

  addTask$(
    task: TaskManager.Task,
    options: {
      position?: number;
    } = {}
  ): Observable<TaskManager.Event> {
    let taskContainer = this.createTask(task, options);
    return taskContainer.events;
  }

  clearTask(id: string): void {
    let taskIndex = this.getTaskPosition(id);
    if (taskIndex !== -1) {
      let removed = this._tasks.splice(taskIndex, 1);
      if (removed.length !== 1) {
        throw new Error(
          `Internal error: clear task removed ${removed.length} task(s). Clear task must removed exactly 1 task. It's probably a bug.`
        );
      }
      debug(`${removed[0].task.id}: cleared`);
    } else {
      debug(`${id}: does not exist, cannot remove`);
    }
  }

  cancelAll() {
    this._tasks.forEach(task => {
      this._cancel(task);
    });
  }

  clearAll() {
    this._tasks = [];
  }

  exec(taskId: string, context: any): Observable<any> {
    let container = this.container(taskId);
    container.meta.context = context;
    if (!container) {
      return throwError(new Error(`Task with id "${taskId}" does not exist`));
    }
    return this.execAsObservable(container, context);
  }

  private execAsObservable(task: TaskContainer, context: any) {
    return new Observable<TaskManager.Event>(emitter => {
      (async () => {
        try {
          await this._exec(task, emitter, context);
          emitter.complete();
        } catch (err) {
          emitter.error(err);
        }
      })();
    }).pipe(share());
  }

  execNext() {
    return new Observable<TaskManager.Event>(emitter => {
      (async () => {
        try {
          if (this._tasks.length > 0) {
            await this._exec(this._tasks[0], emitter);
          }
          emitter.complete();
        } catch (err) {
          emitter.error(err);
        }
      })();
    }).pipe(share());
  }

  execDelayedTasks() {
    return this.execTasksByState("delayed");
  }

  execPendingTasks(): Observable<TaskManager.Event> {
    return this.execTasksByState("pending");
  }

  execTasksByState(
    state: TaskManager.TaskState
  ): Observable<TaskManager.Event> {
    let obs = Observable.create((emitter: Subscriber<TaskManager.Event>) => {
      (async () => {
        try {
          let pendingTasks = this._tasks.filter(
            container => container.meta.state === state
          );
          debug(
            `execAll() with ${
              pendingTasks.length
            } task(s) (state == ${state}): ${pendingTasks
              .map(task => task.task.id)
              .join(", ")}`
          );
          for (let pendingTask of pendingTasks) {
            await this._exec(pendingTask, emitter);
          }
          debug(`execAll() COMPLETED`);
          emitter.complete();
        } catch (err) {
          debug(`execAll() ERROR`);
          emitter.error(err);
        }
      })();
    });
    return obs.pipe(share());
  }

  getTaskPosition(id: string): number {
    return this._tasks.findIndex(container => container.task.id === id);
  }

  private async _exec(
    taskContainer: TaskContainer,
    emitter: Subscriber<TaskManager.Event>,
    context?: any
  ) {
    let task = taskContainer.task;
    try {
      debug(`${task.id} _exec() starting`);
      taskContainer.meta.state = "running";
      this._emit(
        {
          type: "BEFORE_TASK",
          task: task
        },
        [emitter, taskContainer.events]
      );
      let result = await task.exec(context || taskContainer.meta.context);
      // this.clearTask(task.id);
      this._emit(
        {
          type: "AFTER_TASK",
          task: task,
          result: result
        },
        [emitter, taskContainer.events]
      );
      taskContainer.meta.result = result;
      taskContainer.meta.state = "done";
      debug(`${task.id} _exec() DONE`);
      // taskContainer.meta.obs.complete();
    } catch (err) {
      this._onTaskExecError(taskContainer, err);
      throw err;
      // if (task.onError) {
      //   try {
      //     task.onError(err, taskContainer);
      //   }
      //   catch (newError) {
      //     this._onTaskError(taskContainer, newError);
      //     throw err;
      //   }
      // }
      // else {
      //   this._onTaskError(taskContainer, err);
      //   throw err;
      // }
    }
  }

  private _onTaskExecError(taskContainer: TaskContainer, err: Error) {
    taskContainer.meta.error = err;
    let isDelayed = this._isDelayError(err);
    let newState: TaskManager.TaskState = isDelayed ? "delayed" : "done";
    debug(taskContainer.task.id, "_onTaskError newState: ", newState);
    taskContainer.meta.state = newState;
    taskContainer.events.next({
      type: "ERROR_TASK",
      error: err,
      delayed: isDelayed,
      task: taskContainer.task
    });
  }

  private async _cancel(taskContainer: TaskContainer) {
    try {
      debug("cancel task: ", taskContainer.task.id);
      let task = taskContainer.task;
      if (task.cancel) {
        await task.cancel();
        this._emit({
          type: "CANCEL_TASK",
          task: task
        });
      }
      taskContainer.meta.state = "pending";
    } catch (err) {
      this._onError(err);
    }
    // this.clearTask(taskContainer.task.id);
  }

  private _emit(
    event: TaskManager.Event,
    emitters: (
      | Subscriber<TaskManager.Event>
      | Subject<TaskManager.Event>
    )[] = []
  ) {
    this._events.next(event);
    emitters.forEach(emitter => {
      emitter.next(event);
    });
  }

  private _onError(err: Error) {
    console.warn("Error task", err);
    // TODO
  }

  private _isDelayError(err: Error) {
    debug("_isDelayError", err);
    let isUnauthorizedError =
      err["code"] === TapResponseErrorCode &&
      (err as ResponseError).response.codeRet() ===
        ResultCode.IOTIZE_401_UNAUTHORIZED;
    if (isUnauthorizedError) {
      return true;
    } else if (
      isUnauthorizedError ||
      err["code"] == TapClientError.Code.NotConnectedError ||
      err["code"] === "NfcTagLostError" ||
      err["code"] === "NfcNotConnectedError"
    ) {
      // debug(this.config.key, `Request failed: ${err.message}. Will retry after login`);
      return true;
    }
    return false;
  }
}
