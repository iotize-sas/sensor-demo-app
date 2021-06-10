import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from "@angular/router";
import { ConnectedTapResolver } from "@iotize/ionic";

import { Tap } from "@iotize/tap";

export interface TapRouteData {
  tap: Tap | any;
}

@Injectable({
  providedIn: "root"
})
export class TapDevicePageResolverService implements Resolve<TapRouteData> {
  constructor(protected tapResolver: ConnectedTapResolver) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const tapResolved = await this.tapResolver.resolve(route, state);
    return {
      tap: tapResolved
    };
  }
}
