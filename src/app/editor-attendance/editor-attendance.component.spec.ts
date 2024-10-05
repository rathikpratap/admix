import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorAttendanceComponent } from './editor-attendance.component';

describe('EditorAttendanceComponent', () => {
  let component: EditorAttendanceComponent;
  let fixture: ComponentFixture<EditorAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
