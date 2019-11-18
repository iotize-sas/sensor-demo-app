import { Component, OnInit, OnDestroy } from "@angular/core";
import { CurrentDeviceService } from "@iotize/ionic";
import { Router, NavigationStart } from "@angular/router";
import { monitoringRoutes } from "./monitoring-page-routes";
import { Subscription } from "rxjs";
import { TapMonitoringService } from "app-lib";

@Component({
  selector: "app-monitoring-page",
  templateUrl: "monitoring-page.component.html"
})
export class MonitoringPageComponent implements OnInit, OnDestroy {
  private sessionStateSub: Subscription;
  private routeSub: Subscription;

  constructor(
    public tapService: CurrentDeviceService,
    public monitoringService: TapMonitoringService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.sessionStateSub = this.tapService.sessionState.subscribe(
      sessionState => {
        if (this.router.url.startsWith("/device/monitoring")) {
          let profileRoute = monitoringRoutes.find(
            route => route.path === sessionState.name
          );
          if (profileRoute) {
            let url = `/device/monitoring/${sessionState.name}`;
            this.router.navigateByUrl(url);
          }
        }
      }
    );
    this.routeSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (!event.url.startsWith("/device/monitoring")) {
          this.stopMonitor();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.sessionStateSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  private stopMonitor() {
    this.monitoringService.stop();
  }
}
