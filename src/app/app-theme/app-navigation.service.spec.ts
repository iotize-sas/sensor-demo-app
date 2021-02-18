import { TestBed } from "@angular/core/testing";
import { AppNavigationService } from "./app-navigation.service";
import { IotizeIonicTestingModule } from "@iotize/ionic/testing";

describe("AppNavigationService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [IotizeIonicTestingModule]
    })
  );

  it("should be created", () => {
    const service: AppNavigationService = TestBed.get(AppNavigationService);
    expect(service).toBeTruthy();
  });
});
