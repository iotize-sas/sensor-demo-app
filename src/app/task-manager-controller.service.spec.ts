import { TestBed } from "@angular/core/testing";
import { IotizeIonicTestingModule } from "@iotize/ionic/testing";

import { TaskManagerControllerService } from "./task-manager-controller.service";

describe("TaskManagerControllerService", () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [IotizeIonicTestingModule]
    })
  );

  it("should be created", () => {
    const service: TaskManagerControllerService = TestBed.get(
      TaskManagerControllerService
    );
    expect(service).toBeTruthy();
  });
});
