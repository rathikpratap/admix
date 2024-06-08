import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstInvoiceComponent } from './est-invoice.component';

describe('EstInvoiceComponent', () => {
  let component: EstInvoiceComponent;
  let fixture: ComponentFixture<EstInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
