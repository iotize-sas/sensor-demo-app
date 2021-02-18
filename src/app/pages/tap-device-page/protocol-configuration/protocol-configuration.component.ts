import { Component, OnInit } from "@angular/core";
import { deepEqual } from "@iotize/common/utility";
import {
  CurrentDeviceService,
  TapInfo,
  TaskManager,
  TaskManagerService
} from "@iotize/ionic";
import { TargetProtocol } from "@iotize/tap";
import {
  SerialSettings,
  TargetS3PProtocolConfiguration,
  TargetSerialModbusProtocolConfiguration
} from "@iotize/tap/service/impl/target";
import { ToastService } from "app-theme";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "protocol-configuration",
  templateUrl: "./protocol-configuration.component.html",
  styleUrls: ["./protocol-configuration.component.scss"]
})
export class ProtocolConfigurationComponent implements OnInit {
  public APPLY_SERIAL_SETTINGS_TASK_ID = "apply-serial-settings";

  protocolConfig = [
    {
      key: TapInfo.TargetProtocol,
      editable: false
    },
    {
      key: TapInfo.IsTargetConnected,
      editable: true
    }
  ];

  TargetProtocol = TargetProtocol;

  targetProtocol: TargetProtocol = TargetProtocol.NONE;
  applySerialSettingsTask: TaskManager.TaskContainer;

  public serialModbusItem = {
    data: new PendingChangeItem<TargetSerialModbusProtocolConfiguration>({
      serial: {
        physicalPort: SerialSettings.PhysicalPort.AUTO,
        stopBits: SerialSettings.StopBits.ONE,
        bitParity: SerialSettings.BitParity.NONE,
        dataBits: SerialSettings.DataBits._8,
        hardwareFlowControl: SerialSettings.HardwareFlowControl.NONE,
        handshakeDelimiter: SerialSettings.HandshakeDelimiter.NONE,
        timeout: 50,
        baudRate: 187500
      },
      modbus: {
        offsetFirstRegister: false,
        slave: 0
      }
    }),
    post: data =>
      this.tapService.tap.service.target.setSerialModbusConfiguration(data),
    put: data =>
      this.tapService.tap.service.target.putSerialModbusConfiguration(data),
    get: () => this.tapService.tap.service.target.getSerialModbusConfiguration()
  };

  public forms = {
    [TargetProtocol.S3P]: {
      data: new PendingChangeItem<TargetS3PProtocolConfiguration>({
        mode: TargetS3PProtocolConfiguration.Mode.INDEXED,
        delay: 1
      }),
      post: data =>
        this.tapService.tap.service.target.setS3PConfiguration(data),
      put: data => this.tapService.tap.service.target.putS3PConfiguration(data),
      get: () => this.tapService.tap.service.target.getS3PConfiguration()
    },
    [TargetProtocol.MODBUS]: this.serialModbusItem,
    [TargetProtocol.SERIAL]: this.serialModbusItem
  };

  get currentForm() {
    return this.forms[this.targetProtocol];
  }

  constructor(
    public taskManagerService: TaskManagerService,
    private toast: ToastService,
    public tapService: CurrentDeviceService
  ) {
    tapService
      .getKeyValue$<TargetProtocol>(TapInfo.TargetProtocol)
      .subscribe(v => {
        this.targetProtocol = v;
      });

    this.applySerialSettingsTask = this.taskManagerService.createTask({
      id: this.APPLY_SERIAL_SETTINGS_TASK_ID,
      info: {
        title: "Serial configuration changes",
        feedback: "Serial configuration applied!"
      },
      exec: async (type: "set" | "write" | "refresh" | string) => {
        const form = this.currentForm;
        if (!form) {
          return;
        }
        try {
          switch (type) {
            case "set":
              (await form.post(form.data.pendingSettingsSnasphot)).successful();
              form.data.applyChanges();
              this.onSuccess(
                "Successful wrote new target protocol configuration"
              );
              break;
            case "write":
              (await form.put(form.data.pendingSettingsSnasphot)).successful();
              form.data.applyChanges();
              this.onSuccess(
                "Successful wrote new target protocol configuration"
              );
              break;
            case "refresh":
              const data = (await form.get()).body();
              form.data.setLoadedSettings(data);
              form.data.discardChanges();
              this.onSuccess("Target protocol configuration refreshed");
              break;
            default:
              throw new Error(`Unknown action type "${type}"`);
          }
        } catch (err) {
          this.onError(err);
        }
      }
    });

    this.applySerialSettingsTask.events.subscribe(event => {
      if (event.type === "ERROR_TASK") {
        if (!event.delayed) {
          this.onError(event.error);
        }
      }
    });
  }

  onFormChange(protocol: TargetProtocol, values: any) {
    const form = this.forms[protocol];
    if (form) {
      form.data.setPendingSettings(values);
    } else {
      console.warn(`No form for protocol ${TargetProtocol[protocol]}`);
    }
  }

  onSuccess(message: string) {
    this.toast.success({
      message
    });
  }

  onError(error: Error) {
    this.toast.error(error);
  }

  ngOnInit() {}

  onSerialSettingsChanged(event: any) {
    console.log(event);
  }
}

export class PendingChangeItem<T> {
  pendingSettings: BehaviorSubject<T>;
  private loadedSettings?: T; // real settings

  // loading = new BehaviorSubject<boolean>(false);

  setPendingSettings(settings: T) {
    console.log(
      "Update pending settings",
      settings,
      "exi",
      this.loadedSettings
    );
    this.pendingSettings.next(settings);
  }

  setLoadedSettings(settings: T) {
    this.loadedSettings = settings;
  }

  get pendingSettingsSnasphot(): T {
    return this.pendingSettings.value;
  }

  constructor(protected _defaultSettings: T) {
    this.pendingSettings = new BehaviorSubject<T>(_defaultSettings); // displayed settings
  }

  async applyChanges() {
    this.loadedSettings = {
      ...this.pendingSettingsSnasphot
    };
  }

  discardChanges() {
    const prevSettings = this.loadedSettings
      ? this.loadedSettings
      : this._defaultSettings;
    this.pendingSettings.next(prevSettings);
  }

  hasChanges(): boolean {
    if (!this.loadedSettings) {
      return true;
    }
    return !deepEqual(this.pendingSettingsSnasphot, this.loadedSettings);
  }

  // onError(error: Error) {
  //   this.errors.next(error);
  // }
}
