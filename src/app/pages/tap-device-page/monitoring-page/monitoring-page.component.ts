import { Component, OnInit, OnDestroy } from "@angular/core";
import { CurrentDeviceService } from "@iotize/ionic";
import { NavController } from "@ionic/angular";
import { Router, ActivatedRoute } from "@angular/router";
import { monitoringRoutes } from "./monitoring-page-routes";
import { Subscription } from "rxjs";
import { TapMonitoringService } from "app-lib";

@Component({
  selector: "app-monitoring-page",
  templateUrl: "monitoring-page.component.html"
})
export class MonitoringPageComponent implements OnInit, OnDestroy {
  private sessionStateSub?: Subscription;

  constructor(
    public tapService: CurrentDeviceService,
    public monitoringService: TapMonitoringService,
    public router: Router,
    private navController: NavController,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const componentRoutePath = "/device/monitoring";
    this.sessionStateSub = this.tapService.sessionState.subscribe(
      sessionState => {
        if (this.router.url.startsWith(componentRoutePath)) {
          let profileRoute = monitoringRoutes.find(
            route => route.path === sessionState.name
          );
          if (profileRoute) {
            this.navController
              .navigateRoot(componentRoutePath + "/" + profileRoute.path)
              // .navigate([profileRoute.path], {
              //   relativeTo: this.activatedRoute
              // })
              .then(result => {
                if (!result) {
                  console.warn(
                    "Fail to navigate to user profile ",
                    profileRoute.path
                  );
                }
              });
          }
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.sessionStateSub?.unsubscribe();
  }
}
