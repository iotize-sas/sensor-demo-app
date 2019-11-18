import { Component, AfterViewInit, OnInit, OnDestroy } from "@angular/core";
import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Subscription } from "rxjs";
import { CurrentDeviceService } from "@iotize/ionic";
import { ToastService, AppNavigationService } from "app-theme";
import { Dialogs } from "@ionic-native/dialogs/ngx";
import { NavController } from "@ionic/angular";
import { MyTapConnectionService } from "./my-tap-connection.service";
import { environment } from "src/environments/environment";
import { TaskManagerControllerService } from "./task-manager-controller.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  nfcSubscription: Subscription;
  backButtonSubscription: Subscription;

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
    private taskManagerControllerService: TaskManagerControllerService
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
        console.log(`Back button on `, window.location);
        if (window.location.pathname.startsWith("/device/monitoring")) {
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
          console.log(`Default back button behavior`);
          this.navController.back();
        }
      }
    );
  }
}
