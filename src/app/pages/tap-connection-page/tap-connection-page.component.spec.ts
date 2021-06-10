import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TapConnectionPageComponent } from "./tap-connection-page.component";

describe("TapConnectionPageComponent", () => {
  let component: TapConnectionPageComponent;
  let fixture: ComponentFixture<TapConnectionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TapConnectionPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TapConnectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
