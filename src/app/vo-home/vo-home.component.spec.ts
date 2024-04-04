import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoHomeComponent } from './vo-home.component';

describe('VoHomeComponent', () => {
  let component: VoHomeComponent;
  let fixture: ComponentFixture<VoHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
