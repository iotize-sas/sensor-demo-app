import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TapConnectBleTabComponent } from "./connect-ble.component";

describe("ConnectBleComponent", () => {
  let component: TapConnectBleTabComponent;
  let fixture: ComponentFixture<TapConnectBleTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TapConnectBleTabComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TapConnectBleTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
