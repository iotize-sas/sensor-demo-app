import { TestBed } from "@angular/core/testing";

import { MyTapConnectionService } from "./my-tap-connection.service";

describe("MyTapConnectionService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: MyTapConnectionService = TestBed.get(MyTapConnectionService);
    expect(service).toBeTruthy();
  });
});
