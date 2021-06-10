import { Component, Input, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { NotificationItem } from "./definitions";

type AugmentedNotificationItem = NotificationItem & {
  icon?: string;
  color?: string;
};

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"]
})
export class NotificationsComponent implements OnInit {
  public _notifications = [];

  @Input() set notifications(notifications: NotificationItem[]) {
    const newNotifications: AugmentedNotificationItem[] = [];
    for (let i = 0; i < notifications.length; i++) {
      const n = notifications[
        notifications.length - (i + 1)
      ] as AugmentedNotificationItem;
      n.icon = this.getIconName(n);
      n.color = this.getColorName(n);
      newNotifications.push(n);
    }
    this._notifications = newNotifications;
  }

  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  getIconName(item: AugmentedNotificationItem) {
    switch (item.type) {
      case "error":
      case "warning":
        return "alert-circle";
      default:
        return "info-circle";
    }
  }

  getColorName(item: AugmentedNotificationItem) {
    switch (item.type) {
      case "error":
        return "danger";
      case "warning":
        return "warning";
      default:
        return "";
    }
  }
}
