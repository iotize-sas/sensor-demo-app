import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import {
  TaskManagerActionCancelDirective,
  TaskManagerComponent
} from "./task-manager.component";

let fixture: ComponentFixture<TaskManagerComponent>;
let component: TaskManagerComponent;
let content: TaskManagerComponentTestHelper;

fdescribe("TaskManagerComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskManagerComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    content = new TaskManagerComponentTestHelper();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should contains a app-task-manager-action", () => {
    expect(content.taskActionTemplate).not.toBeNull();
    expect(
      (content.taskActionTemplate.nativeElement as HTMLLIElement).textContent
    ).toEqual("test");
  });
});

class TaskManagerComponentTestHelper {
  taskDelayTemplate: DebugElement;
  taskActionTemplate: DebugElement;
  constructor() {
    this.taskDelayTemplate = fixture.debugElement.query(
      By.directive(TaskManagerActionCancelDirective)
    );
    this.taskActionTemplate = fixture.debugElement.query(
      By.directive(TaskManagerActionBisDirective)
    );
  }
}
