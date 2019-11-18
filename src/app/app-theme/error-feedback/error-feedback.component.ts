import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-feedback-error",
  templateUrl: "./error-feedback.component.html",
  styleUrls: ["./error-feedback.component.scss"]
})
export class ErrorFeedbackComponent implements OnInit {
  @Input() error: Error | string;

  @Input() icon?: string;

  constructor() {}

  ngOnInit() {}

  public get errorMessage() {
    if (typeof this.error === "string") {
      return this.error;
    }
    return this.error.message || this.error.name || "unknown error";
  }
}
