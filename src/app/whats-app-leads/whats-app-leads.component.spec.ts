import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsAppLeadsComponent } from './whats-app-leads.component';

describe('WhatsAppLeadsComponent', () => {
  let component: WhatsAppLeadsComponent;
  let fixture: ComponentFixture<WhatsAppLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsAppLeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsAppLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
