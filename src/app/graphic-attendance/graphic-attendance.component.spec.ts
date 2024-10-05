import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicAttendanceComponent } from './graphic-attendance.component';

describe('GraphicAttendanceComponent', () => {
  let component: GraphicAttendanceComponent;
  let fixture: ComponentFixture<GraphicAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
