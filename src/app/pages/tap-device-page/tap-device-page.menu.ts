import { MenuItem } from "app-theme";

export var DEVICE_MENU: MenuItem[] = [
  {
    title: "Device info",
    icon: "information-circle",
    url: "/device/info"
  },
  {
    title: "About",
    icon: "help",
    url: "/about"
  },
  {
    title: "Target settings",
    icon: "barcode",
    url: "/device/protocol-configuration"
  },
  {
    title: "Supervision",
    icon: "construct",
    url: "/device/settings"
  },
  {
    title: "Connectivity settings",
    icon: "cog",
    url: "/device/connectivity"
  },
  {
    title: "Monitoring",
    icon: "analytics",
    url: "/device/monitoring"
  }
];
