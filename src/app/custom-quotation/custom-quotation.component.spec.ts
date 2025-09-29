import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomQuotationComponent } from './custom-quotation.component';

describe('CustomQuotationComponent', () => {
  let component: CustomQuotationComponent;
  let fixture: ComponentFixture<CustomQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomQuotationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
