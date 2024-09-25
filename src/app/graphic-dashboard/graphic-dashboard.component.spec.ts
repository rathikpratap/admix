import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicDashboardComponent } from './graphic-dashboard.component';

describe('GraphicDashboardComponent', () => {
  let component: GraphicDashboardComponent;
  let fixture: ComponentFixture<GraphicDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
