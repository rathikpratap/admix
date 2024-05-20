import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoProjectsComponent } from './vo-projects.component';

describe('VoProjectsComponent', () => {
  let component: VoProjectsComponent;
  let fixture: ComponentFixture<VoProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoProjectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
