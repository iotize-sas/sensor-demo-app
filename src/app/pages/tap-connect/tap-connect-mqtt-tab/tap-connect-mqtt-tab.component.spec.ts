import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TapConnectMqttTabComponent } from "./tap-connect-mqtt-tab.component";

describe("TapConnectMqttTabComponent", () => {
  let component: TapConnectMqttTabComponent;
  let fixture: ComponentFixture<TapConnectMqttTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TapConnectMqttTabComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TapConnectMqttTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
