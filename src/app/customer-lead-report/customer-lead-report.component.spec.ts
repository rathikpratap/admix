import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLeadReportComponent } from './customer-lead-report.component';

describe('CustomerLeadReportComponent', () => {
  let component: CustomerLeadReportComponent;
  let fixture: ComponentFixture<CustomerLeadReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerLeadReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerLeadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
