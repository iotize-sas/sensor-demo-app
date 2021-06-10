import { TestBed } from "@angular/core/testing";

import { CanActivateDashboardService } from "./can-activate-dashboard.service";

describe("CanActivateDashboardService", () => {
  let service: CanActivateDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanActivateDashboardService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
