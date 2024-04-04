import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoNavbarComponent } from './vo-navbar.component';

describe('VoNavbarComponent', () => {
  let component: VoNavbarComponent;
  let fixture: ComponentFixture<VoNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
