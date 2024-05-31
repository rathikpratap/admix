import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPayrollComponent } from './editor-payroll.component';

describe('EditorPayrollComponent', () => {
  let component: EditorPayrollComponent;
  let fixture: ComponentFixture<EditorPayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorPayrollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
