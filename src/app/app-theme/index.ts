import {
  TaskManagerService,
  TaskManagerUiModule,
  TaskManager
} from "@iotize/ionic";

export * from "./app-theme.module";
export * from "./loader.service";
export * from "./toast.service";
export * from "./app-navigation.service";

export { SideMenuComponent } from "./side-menu/side-menu.component";
export {
  DEVICE_MENU_PROVIDER,
  HOME_MENU_PROVIDER,
  MenuId,
  Menus,
  SideMenuContentProviderService
} from "./side-menu/side-menu-content-provider.service";
export {
  MenuItem,
  MenuUrl,
  ParentMenuItem,
  SubMenuItem
} from "./side-menu/definitions";

export { TapControlMenuComponent } from "./tap-control-menu/tap-control-menu.component";

export { TaskManagerService, TaskManager, TaskManagerUiModule };

export { NotificationItem } from "./notifications/definitions";
export { NotificationsComponent } from "./notifications/notifications.component";
