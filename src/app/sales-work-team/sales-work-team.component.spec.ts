import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesWorkTeamComponent } from './sales-work-team.component';

describe('SalesWorkTeamComponent', () => {
  let component: SalesWorkTeamComponent;
  let fixture: ComponentFixture<SalesWorkTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesWorkTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesWorkTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
