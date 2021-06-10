import { NavigationExtras } from "@angular/router";

export type MenuItem = ParentMenuItem | SubMenuItem;

export type MenuUrl = string | [string[], NavigationExtras | undefined];

export interface ParentMenuItem {
  title: string;
  icon?: string;
  url?: MenuUrl;
  children?: SubMenuItem[];
  open?: boolean;
  minTapVersion?: string;
  id?: "dashboard" | string;
}

export interface SubMenuItem {
  title: string;
  url: MenuUrl;
  icon?: string;
  minTapVersion?: string;
  children?: undefined;
  id?: string;
}
