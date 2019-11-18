import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TapConnectSocketTabComponent } from "./tap-connect-socket-tab.component";

describe("TapConnectSocketTabComponent", () => {
  let component: TapConnectSocketTabComponent;
  let fixture: ComponentFixture<TapConnectSocketTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TapConnectSocketTabComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TapConnectSocketTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
