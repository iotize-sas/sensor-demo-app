import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-not-found-page",
  templateUrl: "./not-found-page.component.html",
  styleUrls: ["./not-found-page.component.scss"]
})
export class NotFoundPageComponent implements OnInit {
  public environment = environment;

  constructor() {}

  ngOnInit() {}
}
