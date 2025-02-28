import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewB2bProjectsComponent } from './new-b2b-projects.component';

describe('NewB2bProjectsComponent', () => {
  let component: NewB2bProjectsComponent;
  let fixture: ComponentFixture<NewB2bProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewB2bProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewB2bProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
