import { browser, by, element } from "protractor";

export class AppPage {
  navigateToScan() {
    return browser.get("/");
  }

  navigateTo() {
    return browser.get("/");
  }

  navigateToMonitoring() {
    return browser.get("/device/monitoring");
  }

  navigateToDeviceInfo() {
    return browser.get("/device/info");
  }

  getParagraphText() {
    return element(by.deepCss("app-root ion-content")).getText();
  }
}
