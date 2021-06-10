import { TestBed } from "@angular/core/testing";

import { SideMenuContentProviderService } from "./side-menu-content-provider.service";

describe("SideMenuContentProviderService", () => {
  let service: SideMenuContentProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideMenuContentProviderService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
