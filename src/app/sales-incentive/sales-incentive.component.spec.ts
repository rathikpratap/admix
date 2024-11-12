import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesIncentiveComponent } from './sales-incentive.component';

describe('SalesIncentiveComponent', () => {
  let component: SalesIncentiveComponent;
  let fixture: ComponentFixture<SalesIncentiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesIncentiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesIncentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
