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
});
