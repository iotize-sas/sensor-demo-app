import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Subject } from "rxjs";
import { MenuItem } from "./definitions";

export interface Menus {
  home: BehaviorSubject<MenuItem[]>;
  device: BehaviorSubject<MenuItem[]>;
}

export const DEVICE_MENU_PROVIDER = "DEVICE_MENU_PROVIDER";
export const HOME_MENU_PROVIDER = "HOME_MENU_PROVIDER";

export type MenuId = keyof Menus;

@Injectable({
  providedIn: "root"
})
export class SideMenuContentProviderService {
  private _menu: Menus;
  private _initialState;

  constructor(
    @Inject(HOME_MENU_PROVIDER) homeMenu: MenuItem[],
    @Inject(DEVICE_MENU_PROVIDER) deviceMenu: MenuItem[]
  ) {
    this._initialState = {
      home: homeMenu,
      device: deviceMenu
    };

    this._menu = {
      home: new BehaviorSubject<MenuItem[]>(homeMenu),
      device: new BehaviorSubject<MenuItem[]>(deviceMenu)
    };
  }

  menu(menuId: keyof Menus) {
    if (!(menuId in this._menu)) {
      throw new Error(`Menu "${menuId}" does not exist`);
    }
    return this._menu[menuId];
  }

  updateDashboardLinks(items: MenuItem[]) {
    this.updateMenu("device", items);
  }

  updateMenu(menuId: MenuId, newItems: MenuItem[]) {
    return this._menu[menuId].next([
      ...this._initialState[menuId],
      ...newItems
    ]);
  }
}
