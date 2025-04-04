import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCampaignComponent } from './assign-campaign.component';

describe('AssignCampaignComponent', () => {
  let component: AssignCampaignComponent;
  let fixture: ComponentFixture<AssignCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignCampaignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
