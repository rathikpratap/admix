import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesSideNavComponent } from './sales-side-nav.component';

describe('SalesSideNavComponent', () => {
  let component: SalesSideNavComponent;
  let fixture: ComponentFixture<SalesSideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesSideNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
