import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadLeadsComponent } from './download-leads.component';

describe('DownloadLeadsComponent', () => {
  let component: DownloadLeadsComponent;
  let fixture: ComponentFixture<DownloadLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadLeadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
