import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicNavbarComponent } from './graphic-navbar.component';

describe('GraphicNavbarComponent', () => {
  let component: GraphicNavbarComponent;
  let fixture: ComponentFixture<GraphicNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
