import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPayrollComponent } from './all-payroll.component';

describe('AllPayrollComponent', () => {
  let component: AllPayrollComponent;
  let fixture: ComponentFixture<AllPayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPayrollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
