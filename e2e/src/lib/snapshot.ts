import { createWriteStream } from "fs";
import { browser } from "protractor";

// abstract writing screen shot to a file
export function writeScreenShot(data: any, filename: string) {
  var stream = createWriteStream(filename);
  stream.write(new Buffer(data, "base64"));
  stream.end();
}

export async function takeScreenshot(filename: string) {
  let config = await browser.getProcessedConfig();
  let currentCapability = config.capabilities;
  let browserName: string = currentCapability.browserName;
  if (
    currentCapability.chromeOptions &&
    currentCapability.chromeOptions.mobileEmulation &&
    currentCapability.chromeOptions.mobileEmulation.deviceName
  ) {
    browserName = currentCapability.chromeOptions.mobileEmulation.deviceName;
  }
  browserName = browserName.replace(/[^a-zA-Z0-9\-_\. ]/g, "-");
  return browser.takeScreenshot().then(function(png) {
    writeScreenShot(
      png,
      `resources/screenshots/${browserName}-${filename}.png`
    );
  });
}
