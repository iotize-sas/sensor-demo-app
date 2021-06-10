import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot
} from "@angular/router";
import { TapMonitoringService } from "./tap-monitoring.service";

@Injectable({
  providedIn: "root"
})
export class CanDeactivateDashboardService<T> implements CanDeactivate<T> {
  constructor(private monitoringService: TapMonitoringService) {}

  canDeactivate(
    component: T,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ) {
    this.monitoringService.stop();
    return true;
  }
}
