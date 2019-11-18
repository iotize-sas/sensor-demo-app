import { TestBed } from "@angular/core/testing";

import { TaskManagerService } from "./task-manager.service";
import { sleep } from "../../../../projects/tap-device-angular/src/lib/testing";

describe("TaskManagerService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: TaskManagerService = TestBed.get(TaskManagerService);
    expect(service).toBeTruthy();
  });

  describe("with an instance", function() {
    let service: TaskManagerService;

    beforeAll(function() {
      service = TestBed.get(TaskManagerService);
      expect(service).toBeTruthy();
    });
    describe("addTask()/getTaskPosition()", function() {
      it("should be possible to add task in first position", function() {
        service.addTask$(createSuccessTask("test2"));
        service.addTask$(createSuccessTask("test1"), {
          position: 0
        });
        expect(service.getTaskPosition("test1")).toEqual(0);
      });
    });

    describe("task()", function() {
      it("should be possible to get task when it exists", function() {
        service.addTask$(createSuccessTask("test1"));
        expect(service.task("test1").id).toEqual("test1");
      });
      it("should return undefined when it does not exist", function() {
        expect(service.task("unknowntask")).toEqual(undefined);
      });
    });

    describe("execAll", function() {
      it("when there is no tasks it should resolved immediatly", async function() {
        await service.execPendingTasks().toPromise();
      });

      it("when there is a task it should emit events and complete when done and clear task", async function(done) {
        let events = [];
        service.addTask$(createSuccessTask("task1", "Hello "));
        service.addTask$(createSuccessTask("task2", "World!"));

        service.execPendingTasks().subscribe({
          next: event => {
            events.push(event);
          },
          complete: () => {
            expect(events.length).toBeGreaterThan(0);
            expect(service.tasks.length).toEqual(
              0,
              `tasks list should be empty but found ${service.tasks
                .map(task => task.id)
                .join()}`
            );
            expect(service.hasTask("task1")).toBeFalsy(
              "task1 should have been removed from tasks list"
            );
            expect(service.hasTask("task2")).toBeFalsy(
              "task2 should have been removed from tasks list"
            );
            done();
          }
        });
      });

      it("when one of the task as an error it should stop", function(done) {
        service.addTask$(createErrorTask("taskwitherror"));

        expect(service.hasTask("taskwitherror")).toBeTruthy();

        service.execPendingTasks().subscribe({
          complete: () => {
            throw new Error(
              `execAll observable should not complete when there is an error in task`
            );
          },
          error: err => {
            expect(service.hasTask("taskwitherror")).toBeTruthy();
            done();
          }
        });
      });
    });

    describe("clearAll", function() {
      it("should remove all tasks", function() {
        service.addTask$({
          id: "task1",
          exec: async () => {}
        });
        expect(service.tasks.length).toBeGreaterThan(0);

        service.clearAll();

        expect(service.tasks.length).toEqual(0);
      });

      describe("clearTask", function() {
        beforeEach(function() {
          service.addTask$(createSuccessTask("task1"));
          service.addTask$(createSuccessTask("task2"));
          service.addTask$(createSuccessTask("task3"));
        });

        it("should works when task exists", function() {
          expect(service.hasTask("task2")).toBeTruthy();
          service.clearTask("task2");
          expect(service.hasTask("task2")).toBeFalsy();

          expect(service.hasTask("task1")).toBeTruthy();
          service.clearTask("task1");
          expect(service.hasTask("task1")).toBeFalsy();

          expect(service.hasTask("task3")).toBeTruthy();
          service.clearTask("task3");
          expect(service.hasTask("task3")).toBeFalsy();
        });

        it("should works when task does NOT exist", function() {
          expect(service.hasTask("myunknowtaskid")).toBeFalsy();
          service.clearTask("myunknowtaskid");
          expect(service.hasTask("myunknowtaskid")).toBeFalsy();
        });
      });
    });
    // it('it should be possible to add a task', function () {
    //   service.addTask({
    //     id: 'task1',
    //     exec: async () => {
    //       waits(100);
    //       return 'ok';
    //     }
    //   });

    //   service.clearTask('task1');

    //   let obs = service.execAll();
    // })
  });
});

function createSuccessTask(
  id: string = "tasksuccess",
  result: any = undefined
) {
  return {
    id: id,
    exec: async () => {
      await sleep(10);
      return result;
    }
  };
}

function createErrorTask(id: string = "taskerror") {
  return {
    id: id,
    exec: async () => {
      throw new Error(`Error for tash: ${id}`);
    }
  };
}
