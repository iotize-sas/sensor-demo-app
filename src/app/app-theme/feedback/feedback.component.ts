import { Component, OnInit, Input } from "@angular/core";

export interface FeedbackAction {
  title?: string;
  icon?: string;
  action: () => void;
}

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.component.html",
  styleUrls: ["./feedback.component.scss"]
})
export class FeedbackComponent implements OnInit {
  @Input() color: string = "success";

  @Input() message?: string = undefined;

  @Input() icon?: string = undefined;

  @Input() actions: FeedbackAction[] = [];
  constructor() {}

  ngOnInit() {}
}
