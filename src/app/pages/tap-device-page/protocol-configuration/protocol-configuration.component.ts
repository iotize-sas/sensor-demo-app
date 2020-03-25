import { Component, OnInit } from "@angular/core";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import {
  CurrentDeviceService,
  MODBUS_SETTINGS_FIELDS,
  SERIAL_SETTINGS_FIELDS,
  ProtocolConfigurationService
} from "@iotize/ionic";
import { ToastService, TaskManagerService, TaskManager } from "app-theme";

const APPLY_SERIAL_SETTINGS_TASK_ID = "apply-serial-settings";

@Component({
  selector: "protocol-configuration",
  templateUrl: "./protocol-configuration.component.html",
  styleUrls: ["./protocol-configuration.component.scss"]
})
export class ProtocolConfigurationComponent implements OnInit {
  isAdmin: Observable<boolean>;

  public SERIAL_SETTINGS_FIELDS = SERIAL_SETTINGS_FIELDS;
  public MODBUS_SETTINGS_FIELDS = MODBUS_SETTINGS_FIELDS;

  public get tap() {
    return this.tapService.tap;
  }

  constructor(
    private tapService: CurrentDeviceService,
    public protocolSettings: ProtocolConfigurationService,
    public taskManagerService: TaskManagerService,
    private toastService: ToastService
  ) {
    this.isAdmin = this.tapService.sessionState.pipe(
      map(state => state.name === "admin")
    );

    let taskContainer = this.taskManagerService.createTask({
      id: APPLY_SERIAL_SETTINGS_TASK_ID,
      info: {
        title: "Serial configuration changes",
        feedback: "Serial configuration applied!"
      },
      exec: async (type: "set" | "write" | "refresh") => {
        switch (type) {
          case "set":
          case "write":
            return this.protocolSettings
              .applyChanges(type === "set")
              .catch(err => {
                if (err.cause) {
                  throw err.cause;
                }
              })
              .then(() => {
                this.onSuccess("Serial configuration applied");
              });
          case "refresh":
            return this.protocolSettings
              .refresh()
              .catch(err => {
                if (err.cause) {
                  throw err.cause;
                }
              })
              .then(() => {
                this.onSuccess("Serial configuration refreshed!");
              });
          default:
            return Promise.reject(`Unknown action type "${type}"`);
        }
      }
    });

    taskContainer.events.subscribe(event => {
      if (event.type === "ERROR_TASK") {
        if (!event.delayed) {
          this.onError(event.error);
        }
      }
    });
  }

  async ngOnInit() {}

  async discardChanges() {
    try {
      await this.protocolSettings.discardChanges();
    } catch (err) {
      this.onError(err);
    }
  }

  private onError(err: Error) {
    this.toastService.error(err);
  }

  private onSuccess(msg: string) {
    this.toastService.success({
      message: msg
    });
  }
}
