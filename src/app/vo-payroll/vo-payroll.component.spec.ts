import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoPayrollComponent } from './vo-payroll.component';

describe('VoPayrollComponent', () => {
  let component: VoPayrollComponent;
  let fixture: ComponentFixture<VoPayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoPayrollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
