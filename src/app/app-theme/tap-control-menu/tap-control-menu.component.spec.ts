import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { TapControlMenuComponent } from "./tap-control-menu.component";

describe("TapControlMenuComponent", () => {
  let component: TapControlMenuComponent;
  let fixture: ComponentFixture<TapControlMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TapControlMenuComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TapControlMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
