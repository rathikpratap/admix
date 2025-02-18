import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeaderProjectsComponent } from './team-leader-projects.component';

describe('TeamLeaderProjectsComponent', () => {
  let component: TeamLeaderProjectsComponent;
  let fixture: ComponentFixture<TeamLeaderProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamLeaderProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamLeaderProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
