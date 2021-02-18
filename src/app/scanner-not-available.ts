import { DeviceScanner, DeviceScannerOptions } from "@iotize/tap/scanner/api";
import { of, never } from "rxjs";

export class ScannerNotAvailable implements DeviceScanner<any> {
  scanning = of(false);
  isScanning = false;
  results = never();

  constructor(public message: string) {}

  start(option?: DeviceScannerOptions) {
    return Promise.reject(this.message);
  }
  stop() {
    return Promise.reject(this.message);
  }
}
