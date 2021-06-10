import { TestBed } from "@angular/core/testing";

import { MonitoringPageGuard } from "./monitoring-page.guard";

describe("MonitoringPageGuard", () => {
  let guard: MonitoringPageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MonitoringPageGuard);
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });
});
