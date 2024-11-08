import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveCalculationComponent } from './incentive-calculation.component';

describe('IncentiveCalculationComponent', () => {
  let component: IncentiveCalculationComponent;
  let fixture: ComponentFixture<IncentiveCalculationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncentiveCalculationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncentiveCalculationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
