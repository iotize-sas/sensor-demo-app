import { Component, Input } from "@angular/core";
import { MenuItem } from "./definitions";

@Component({
  selector: "app-side-menu",
  templateUrl: "./side-menu.component.html",
  styleUrls: ["./side-menu.component.scss"]
})
export class SideMenuComponent {
  @Input() pages: MenuItem[] = [];

  constructor() {}
}
