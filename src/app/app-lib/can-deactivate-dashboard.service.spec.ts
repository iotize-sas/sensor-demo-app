import { TestBed } from "@angular/core/testing";

import { CanDeactivateDashboardService } from "./can-deactivate-dashboard.service";

describe("CanDeactivateDashboardService", () => {
  let service: CanDeactivateDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanDeactivateDashboardService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
