import { Component, OnInit, Input } from "@angular/core";

export interface StepInfo {
  title: string;
  subTitle?: string;
  meta?: Record<string, any>;
  progress?: StepInfo.Progress;
}

export namespace StepInfo {
  export interface Progress {
    current?: number;
    total?: number;
    percent?: number;
  }
}

@Component({
  selector: "app-progress-bar-step",
  templateUrl: "./progress-bar-step.component.html",
  styleUrls: ["./progress-bar-step.component.scss"]
})
export class ProgressBarStepComponent implements OnInit {
  @Input() step: StepInfo;

  // @Input() showProgressMessage: boolean = true;

  constructor() {}

  ngOnInit() {}

  get mode(): "determinate" | "indeterminate" {
    return this.step.progress &&
      (this.step.progress.total || this.step.progress.percent)
      ? "determinate"
      : "indeterminate";
  }

  get percent(): number {
    if (this.step.progress) {
      if (this.step.progress.percent) {
        return this.step.progress.percent;
      } else if (this.step.progress.total) {
        let computedPercent =
          (this.step.progress.current || 0) / this.step.progress.total;
        return computedPercent;
      }
    }
    return 0;
  }

  get progressMessage(): string {
    if (this.step.progress.percent) {
      return `${this.step.progress.percent}%`;
    } else if (this.step.progress.total) {
      return `${this.step.progress.current}/${this.step.progress.total}`;
    } else {
      return "";
    }
  }
}
