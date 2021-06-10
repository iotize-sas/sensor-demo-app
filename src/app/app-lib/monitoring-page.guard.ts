import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  ActivatedRoute
} from "@angular/router";
import { CurrentDeviceService } from "@iotize/ionic";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class MonitoringPageGuard implements CanActivate {
  constructor(
    public tapService: CurrentDeviceService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const currentProfile = !this.tapService.hasTap
      ? "anonymous"
      : this.tapService.tap.auth.sessionStateSnapshot.name;
    const allowerRouteProfiles: string[] | undefined = next.data?.username;
    if (allowerRouteProfiles) {
      const isAllowedProfile =
        allowerRouteProfiles.indexOf(currentProfile) >= 0;
      if (!isAllowedProfile) {
        const fullUrl = this.getResolvedUrl(next);
        const parts = fullUrl.split("/");
        const rootUrl = parts.slice(0, parts.length - 1).join("/");
        const newPage = `${rootUrl}/${currentProfile}`;
        this.router.navigateByUrl(newPage);
        return false;
      }
    }
    return true;
  }

  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
      .map(v => v.url.map(segment => segment.toString()).join("/"))
      .join("/")
      .replace(/\/\//g, "/");
  }
}
