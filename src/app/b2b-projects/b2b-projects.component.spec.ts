import { ComponentFixture, TestBed } from '@angular/core/testing';

import { B2bProjectsComponent } from './b2b-projects.component';

describe('B2bProjectsComponent', () => {
  let component: B2bProjectsComponent;
  let fixture: ComponentFixture<B2bProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ B2bProjectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(B2bProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
