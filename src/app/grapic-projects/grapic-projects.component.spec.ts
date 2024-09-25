import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrapicProjectsComponent } from './grapic-projects.component';

describe('GrapicProjectsComponent', () => {
  let component: GrapicProjectsComponent;
  let fixture: ComponentFixture<GrapicProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrapicProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrapicProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
