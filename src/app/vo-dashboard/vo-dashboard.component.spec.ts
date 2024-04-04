import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoDashboardComponent } from './vo-dashboard.component';

describe('VoDashboardComponent', () => {
  let component: VoDashboardComponent;
  let fixture: ComponentFixture<VoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
