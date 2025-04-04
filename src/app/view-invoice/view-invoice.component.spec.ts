import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInvoiceComponent } from './view-invoice.component';

describe('ViewInvoiceComponent', () => {
  let component: ViewInvoiceComponent;
  let fixture: ComponentFixture<ViewInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
