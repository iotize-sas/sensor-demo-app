import { Component, Input, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { MenuItem, MenuUrl } from "./definitions";
import {
  MenuId,
  SideMenuContentProviderService
} from "./side-menu-content-provider.service";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.scss"]
})
export class SideMenuComponent implements OnInit {
  @Input() menuId: MenuId;

  items: MenuItem[] = [];

  constructor(
    public navController: NavController,
    public menuContentProvider: SideMenuContentProviderService
  ) {}

  ngOnInit(): void {
    if (!this.menuId) {
      throw new Error(`SideMenuComponent [menuId] input parameter is required`);
    }
    this.menuContentProvider.menu(this.menuId).subscribe(items => {
      this.items = items;
    });
  }

  navigate(options: MenuUrl) {
    if (typeof options === "string") {
      return this.navController.navigateRoot(options.split("/"));
    } else {
      return this.navController.navigateRoot(options[0], options[1]);
    }
  }
}
