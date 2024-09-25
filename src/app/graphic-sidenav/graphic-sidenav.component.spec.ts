import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicSidenavComponent } from './graphic-sidenav.component';

describe('GraphicSidenavComponent', () => {
  let component: GraphicSidenavComponent;
  let fixture: ComponentFixture<GraphicSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicSidenavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
