import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptPayrollComponent } from './script-payroll.component';

describe('ScriptPayrollComponent', () => {
  let component: ScriptPayrollComponent;
  let fixture: ComponentFixture<ScriptPayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScriptPayrollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScriptPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
