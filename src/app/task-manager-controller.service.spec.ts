import { TestBed } from "@angular/core/testing";

import { TaskManagerControllerService } from "./task-manager-controller.service";

describe("TaskManagerControllerService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: TaskManagerControllerService = TestBed.get(
      TaskManagerControllerService
    );
    expect(service).toBeTruthy();
  });
});
