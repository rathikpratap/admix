import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bPayrollComponent } from './b2b-payroll.component';

describe('B2bPayrollComponent', () => {
  let component: B2bPayrollComponent;
  let fixture: ComponentFixture<B2bPayrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ B2bPayrollComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(B2bPayrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
