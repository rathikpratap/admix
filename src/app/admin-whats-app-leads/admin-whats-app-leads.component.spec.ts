import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminWhatsAppLeadsComponent } from './admin-whats-app-leads.component';

describe('AdminWhatsAppLeadsComponent', () => {
  let component: AdminWhatsAppLeadsComponent;
  let fixture: ComponentFixture<AdminWhatsAppLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminWhatsAppLeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminWhatsAppLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
