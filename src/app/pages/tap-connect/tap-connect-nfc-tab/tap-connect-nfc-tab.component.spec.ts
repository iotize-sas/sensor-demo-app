import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TapConnectNfcTabComponent } from "./tap-connect-nfc-tab.component";

describe("TapConnectNfcTabComponent", () => {
  let component: TapConnectNfcTabComponent;
  let fixture: ComponentFixture<TapConnectNfcTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TapConnectNfcTabComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TapConnectNfcTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
