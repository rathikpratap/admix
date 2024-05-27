import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomLeadsComponent } from './custom-leads.component';

describe('CustomLeadsComponent', () => {
  let component: CustomLeadsComponent;
  let fixture: ComponentFixture<CustomLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomLeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
