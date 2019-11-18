import { AppPage } from "./app.po";
import { takeScreenshot } from "./lib/snapshot";

describe("create app snapshots", () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it("should take home page snapshot", async () => {
    page.navigateToScan();
    await takeScreenshot("scan-page");
  });
  it("should take home device info snapshot", async () => {
    page.navigateToDeviceInfo();
    await takeScreenshot("device-info-page");
  });
  it("should take home device monitoring page snapshot", async () => {
    page.navigateToMonitoring();
    await takeScreenshot("monitoring");
  });
});
