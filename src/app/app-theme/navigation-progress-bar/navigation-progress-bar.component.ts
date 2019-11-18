import { Component, OnInit } from "@angular/core";
import { AppNavigationService } from "../app-navigation.service";

@Component({
  selector: "app-navigation-progress-bar",
  templateUrl: "./navigation-progress-bar.component.html",
  styleUrls: ["./navigation-progress-bar.component.scss"]
})
export class NavigationProgressBarComponent implements OnInit {
  constructor(public appNav: AppNavigationService) {}

  ngOnInit() {}
}
