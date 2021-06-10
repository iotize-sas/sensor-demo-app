import { TestBed } from "@angular/core/testing";

import { TapDevicePageResolverService } from "./tap-device-page-resolver.service";

describe("TapDevicePageResolverService", () => {
  let service: TapDevicePageResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TapDevicePageResolverService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
