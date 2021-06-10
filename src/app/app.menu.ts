import { MenuItem } from "app-theme";

export const HOME_MENU: MenuItem[] = [
  {
    icon: "help",
    title: "About",
    url: "/about"
  },
  {
    icon: "wifi",
    title: "Connection",
    url: "/connect"
  }
];

export const DEVICE_MENU: MenuItem[] = [
  {
    icon: "information-circle",
    title: "Device info",
    url: "/device/info"
  },
  {
    icon: "construct",
    title: "Supervision",
    url: "/device/settings"
  },
  {
    icon: "cog",
    title: "Connectivity settings",
    url: "/device/connectivity"
  },
  {
    icon: "analytics",
    title: "Monitoring",
    url: "/device/monitoring"
  }
];
