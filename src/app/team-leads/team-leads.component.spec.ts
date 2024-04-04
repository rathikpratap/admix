import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLeadsComponent } from './team-leads.component';

describe('TeamLeadsComponent', () => {
  let component: TeamLeadsComponent;
  let fixture: ComponentFixture<TeamLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamLeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
