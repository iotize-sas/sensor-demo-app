import "@iotize/tap/ext/data";
import { Component, AfterViewInit, OnInit, OnDestroy } from "@angular/core";
import { MenuController, Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Subscription } from "rxjs";
import { CurrentDeviceService } from "@iotize/ionic";
import { ToastService, AppNavigationService } from "app-theme";
import { Dialogs } from "@ionic-native/dialogs/ngx";
import { NavController } from "@ionic/angular";
import { MyTapConnectionService } from "./my-tap-connection.service";
import { TaskManagerControllerService } from "./task-manager-controller.service";
import { environment } from "src/environments/environment";

import { dataManagerConfig } from "tap-api";
import { DEVICE_MENU, HOME_MENU } from "./app.menu";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  nfcSubscription: Subscription;
  backButtonSubscription: Subscription;

  public homeMenu = HOME_MENU;
  public deviceMenu = DEVICE_MENU;
  public appTitle = environment.appName;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private tapConnectionService: MyTapConnectionService,
    private tapService: CurrentDeviceService,
    private toastService: ToastService,
    private dialogs: Dialogs,
    private navController: NavController,
    public appNavigationService: AppNavigationService,
    private taskManagerControllerService: TaskManagerControllerService,
    private menu: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      this.tapConnectionService
        .listenToNfcTaps()
        .then(() => {
          console.info("NFC init OK");
        })
        .catch(err => {
          console.warn("NFC initialization failed", err);
        });
    });

    this.tapService.tapRemoved.subscribe(_ => {
      this.menu.enable(false, "deviceMenu");
      this.menu.enable(true, "homeMenu");
    });
    this.tapService.tapChanged.subscribe(newTap => {
      if (newTap) {
        this.menu.enable(true, "deviceMenu");
        this.menu.enable(false, "homeMenu");

        newTap.data.registerBundles(dataManagerConfig.bundles);
      }
    });
  }

  ngOnInit(): void {
    this.setAndroidBackButtonBehavior();
  }

  onError(err: Error) {
    this.toastService.error({
      message: err.message
    });
  }

  ngAfterViewInit() {
    if ("splashscreen" in navigator) {
      (navigator["splashscreen"] as SplashScreen).hide();
    }
  }

  ngOnDestroy(): void {
    this.nfcSubscription.unsubscribe();
  }

  public exitApp() {
    if (this.platform.is("cordova")) {
      navigator["app"].exitApp();
    }
  }

  private setAndroidBackButtonBehavior(): void {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(
      9999,
      () => {
        if (window.location.pathname.startsWith("/device/monitoring")) {
          // TODO remove hard link reference
          this.dialogs
            .confirm("Are sure you want to quit?", "Quit app", [
              "Quit",
              "Cancel"
            ])
            .then(async (choice: number) => {
              switch (choice) {
                case 1:
                  this.tapService.remove();
                  this.exitApp();
                  break;
                case 0:
                default:
              }
            })
            .catch((err: Error) => {
              this.onError(err);
            });
        } else {
          this.navController.back();
        }
      }
    );
  }
}
