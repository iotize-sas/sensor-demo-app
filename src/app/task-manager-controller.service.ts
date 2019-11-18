import { Injectable } from "@angular/core";
import { CurrentDeviceService } from "@iotize/ionic";
import { ConnectionState } from "@iotize/device-client.js/protocol/api";
import { Subscription } from "rxjs";
import { TaskManagerService } from "app-theme";

@Injectable({
  providedIn: "root"
})
export class TaskManagerControllerService {
  subs: Subscription[];

  constructor(
    private tapService: CurrentDeviceService,
    private taskManager: TaskManagerService
  ) {
    this.subs = [];
    this.setupEvents();
  }

  private setupEvents() {
    let connectionStateSub = this.tapService.connectionState.subscribe(
      event => {
        switch (event.newState) {
          case ConnectionState.CONNECTED:
            this._execDelayedTasks();
            break;
        }
      }
    );

    let sessionStateSub = this.tapService.sessionState.subscribe(event => {
      if (event.name !== "anonymous") {
        this._execDelayedTasks();
      }
    });

    this.subs = [connectionStateSub, sessionStateSub];
  }

  private _execDelayedTasks() {
    this.taskManager.execDelayedTasks().subscribe({
      error: err => {
        console.warn("TaskManagerControllerService", err);
        // TODO handle error
      }
    });
  }
}
