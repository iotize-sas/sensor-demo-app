import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TapConnectComponent } from "./tap-connect.component";

describe("TapConnectComponent", () => {
  let component: TapConnectComponent;
  let fixture: ComponentFixture<TapConnectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TapConnectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TapConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
