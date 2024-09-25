import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphicHomeComponent } from './graphic-home.component';

describe('GraphicHomeComponent', () => {
  let component: GraphicHomeComponent;
  let fixture: ComponentFixture<GraphicHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphicHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphicHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
