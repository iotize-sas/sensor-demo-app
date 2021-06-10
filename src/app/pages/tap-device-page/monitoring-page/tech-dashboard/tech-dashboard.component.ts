import { Component, OnInit, OnDestroy } from "@angular/core";
import { CurrentDeviceService, TapInfo } from "@iotize/ionic";
import {
  ConnectionStateChangeEvent,
  ConnectionState
} from "@iotize/tap/protocol/api";
import {
  Subscription,
  Observable,
  BehaviorSubject,
  Subject,
  combineLatest,
  merge
} from "rxjs";
import {
  ToastService,
  NotificationsComponent,
  NotificationItem
} from "app-theme";
import { map, share, startWith, takeUntil } from "rxjs/operators";
import { ModalController } from "@ionic/angular";
import { TapMonitoringSettingsComponent } from "@iotize/ionic/monitoring";
import { MonitoringSettingsService } from "@iotize/ionic/monitoring";
import {
  VariableView,
  TapVariable,
  DataManager,
  MonitoringController,
  createMonitoringTicker,
  MonitorEngine
} from "@iotize/tap/data";
import { Router, NavigationStart } from "@angular/router";
import { TapMonitoringService, UniquePromiseCallService } from "app-lib";
import { Tap, TapError, TapResponseStatusError } from "@iotize/tap";
import { EditableDataStreamInterface } from "@iotize/tap/data";

import {
  PipeConverter,
  ByteSwapConverter,
  ArrayConverter,
  NumberConverter,
  StringConverter,
  FloatConverter,
  BooleanConverter
} from "@iotize/tap/client/impl";
import { ResultCode } from "@iotize/tap/client/api";
import { CodeError, isCodeError } from "@iotize/common/error";

const DEFAULT_TARGET_CONNECT_TRY_COUNT = 2;

@Component({
  selector: "tech-dashboard",
  templateUrl: "./tech-dashboard.component.html",
  styleUrls: ["./tech-dashboard.component.scss"]
})
export class TechDashboardComponent implements OnInit, OnDestroy {
  private connectionStateChangeSub: Subscription;

  /**
   * Variables cache
   */
  variables: Partial<{
    count: TapVariable<number, "count">;

    lEDStatus: TapVariable<number, "lEDStatus">;

    voltage_V: TapVariable<number, "voltage_V">;

    temperature_C: TapVariable<number, "temperature_C">;

    period: TapVariable<number, "period">;

    lEDConfig: TapVariable<number, "lEDConfig">;
  }> = {};

  waitForSubmit: boolean = false;
  isMonitorRunning: boolean = false;
  private destroyed = new Subject<void>();
  private monitoringControllers: MonitoringController[] = [];

  notificationErrors: NotificationItem[] = [];

  get dataManager() {
    if (!this.tapService.hasTap) {
      return undefined;
    }
    return this.tapService.tap.data;
  }

  get isTapConnected() {
    return this.tapService.protocolMeta && this.tap.isConnected();
  }

  constructor(
    public tapService: CurrentDeviceService,
    private modalController: ModalController,
    private monitoringSettingsService: MonitoringSettingsService,
    //, public monitoringService: TapMonitoringService
    private toastService: ToastService,
    private router: Router,
    private uniquePromiseService: UniquePromiseCallService
  ) {}

  async ngOnInit() {
    this.initTapSessionStateListener();
    this.tapService.tapChanged
      .pipe(
        startWith(this.tapService.hasTap ? this.tapService.tap : undefined),
        takeUntil(this.destroyed)
      )
      .subscribe((newTap: Tap | undefined) => {
        if (newTap) {
          this.onNewTapSelected();
        }
      });
  }

  private onNewTapSelected() {
    console.log("Initialize monitoring component with new tap");
    this.isMonitorRunning = false;
    this.initVariableCache();
    this.initComponents();
    this.waitForSubmit = !this.tapService.tap.isConnected();
    this.initMonitoringTickers();

    this.startMonitor();
  }

  private initTapSessionStateListener() {
    this.connectionStateChangeSub = this.tapService.connectionState
      .pipe(takeUntil(this.destroyed))
      .subscribe(async (event: ConnectionStateChangeEvent) => {
        switch (event.newState) {
          case ConnectionState.CONNECTED:
            this.waitForSubmit = false;

            if (this.isMonitorRunning) {
              try {
                await this.connectToTarget();
              } catch (err) {
                this.showError(err);
              }
            }

            break;
          default:
            this.waitForSubmit = true;
        }
      });
  }

  private initMonitoringTickers() {
    this.monitoringControllers.forEach(ctr => {
      ctr.stop();
    });
    const newControllers: MonitoringController[] = [];
    const takeUntilObs = merge(this.destroyed, this.tapService.tapChanged).pipe(
      share()
    );

    const monitoringControllerCountStatus = new MonitoringController({
      period: 500,
      dueTime: 0,
      refresh: false,
      state: MonitorEngine.State.STOP
    });
    const tickerCountStatus = createMonitoringTicker(
      monitoringControllerCountStatus
    );
    tickerCountStatus.pipe(takeUntil(takeUntilObs)).subscribe({
      next: _ => {
        const ressourceName = "count_Status";
        this.uniquePromiseService
          .execute(`bundle-${ressourceName}`, async () => {
            return this.dataManager?.bundle(ressourceName).read();
          })
          .catch(err =>
            this.handleRefreshValueError(
              err,
              ressourceName,
              monitoringControllerCountStatus
            )
          );
      }
    });
    newControllers.push(monitoringControllerCountStatus);

    const monitoringControllerSensors = new MonitoringController({
      period: 300,
      dueTime: 0,
      refresh: false,
      state: MonitorEngine.State.STOP
    });
    const tickerSensors = createMonitoringTicker(monitoringControllerSensors);
    tickerSensors.pipe(takeUntil(takeUntilObs)).subscribe({
      next: _ => {
        const ressourceName = "sensors";
        this.uniquePromiseService
          .execute(`bundle-${ressourceName}`, async () => {
            return this.dataManager?.bundle(ressourceName).read();
          })
          .catch(err =>
            this.handleRefreshValueError(
              err,
              ressourceName,
              monitoringControllerSensors
            )
          );
      }
    });
    newControllers.push(monitoringControllerSensors);

    const monitoringControllerCountControl = new MonitoringController({
      period: 2000,
      dueTime: 0,
      refresh: false,
      state: MonitorEngine.State.STOP
    });
    const tickerCountControl = createMonitoringTicker(
      monitoringControllerCountControl
    );
    tickerCountControl.pipe(takeUntil(takeUntilObs)).subscribe({
      next: _ => {
        const ressourceName = "count_Control";
        this.uniquePromiseService
          .execute(`bundle-${ressourceName}`, async () => {
            return this.dataManager?.bundle(ressourceName).read();
          })
          .catch(err =>
            this.handleRefreshValueError(
              err,
              ressourceName,
              monitoringControllerCountControl
            )
          );
      }
    });
    newControllers.push(monitoringControllerCountControl);

    this.monitoringControllers = newControllers;
    combineLatest(newControllers.map(c => c.asSubject()))
      .pipe(takeUntil(takeUntilObs))
      .subscribe(v => {
        this.isMonitorRunning =
          v.filter(v => v.state === MonitorEngine.State.START).length >= 1;
      });
  }

  private handleRefreshValueError(
    err: CodeError,
    ressourceName: string,
    controller: MonitoringController
  ) {
    if (
      err.code === "TapDataErrorBundleNotConfigured" ||
      err.code === "TapDataErrorVariableNotConfigured"
    ) {
      controller.stop();
    }
    if (
      isCodeError<TapResponseStatusError>(
        TapError.Code.ResponseStatusError,
        err
      )
    ) {
      // We can ignore bad request error as this error occurs when we finish encrypted com session.
      if (err.response.status === ResultCode.BAD_REQUEST) {
        return;
      }
    }
    this.addNotificationError(
      new Error(`Cannot refresh ${ressourceName}: ${err.message}`)
    );
  }

  private initVariableCache() {
    if (!this.dataManager) {
      return;
    }
    try {
      this.variables.count = this.dataManager.variable("count") as TapVariable<
        number,
        "count"
      >;

      this.variables.lEDStatus = this.dataManager.variable(
        "lEDStatus"
      ) as TapVariable<number, "lEDStatus">;

      this.variables.voltage_V = this.dataManager.variable(
        "voltage_V"
      ) as TapVariable<number, "voltage_V">;

      this.variables.temperature_C = this.dataManager.variable(
        "temperature_C"
      ) as TapVariable<number, "temperature_C">;

      this.variables.period = this.dataManager.variable(
        "period"
      ) as TapVariable<number, "period">;

      this.variables.lEDConfig = this.dataManager.variable(
        "lEDConfig"
      ) as TapVariable<number, "lEDConfig">;
    } catch (err) {
      console.warn(err);
      this.showError(err);
    }
  }

  public initComponents() {
    this.notificationErrors = [];
    this.dataManager?.events.subscribe(event => {
      if (event.type === "error") {
        this.addNotificationError(event.error);
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.connectionStateChangeSub.unsubscribe();
  }

  get tap() {
    return this.tapService.tap;
  }

  stopMonitor() {
    this.monitoringControllers.forEach(monitoringController => {
      monitoringController.stop();
    });
  }

  async startMonitor() {
    if (this.isTapConnected) {
      try {
        await this.connectToTarget();
        this.monitoringControllers.forEach(monitoringController => {
          monitoringController.start();
        });
      } catch (err) {
        this.showError(err);
      }
    }
  }

  async openSettings() {
    const modal = await this.modalController.create({
      component: TapMonitoringSettingsComponent
    });

    return await modal.present();
  }

  async connectToTarget(
    maxTry: number = DEFAULT_TARGET_CONNECT_TRY_COUNT
  ): Promise<number> {
    for (let tryNumber = 1; tryNumber <= maxTry; tryNumber++) {
      try {
        (await this.tap.service.target.connect()).successful();
        return tryNumber;
      } catch (err) {
        if (tryNumber >= maxTry) {
          throw new Error(`Device was not able to connect to the target after 
          ${maxTry} attempt(s). Cause: ${err.message}`);
        }
      }
    }
    return 0;
  }

  async changeDevice() {
    await this.tapService.remove();
    this.router.navigate(["/"]);
  }

  async showError(err: Error) {
    this.toastService.error(err);
  }

  async openNotificationErrors() {
    const modal = await this.modalController.create({
      component: NotificationsComponent,
      componentProps: {
        notifications: this.notificationErrors
      }
    });
    return await modal.present();
  }

  private addNotificationError(err: Error) {
    this.notificationErrors.push({
      type: "error",
      message: err.message,
      createdAt: new Date(),
      error: err
    });
  }
}
