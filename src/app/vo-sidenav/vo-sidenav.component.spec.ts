import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoSidenavComponent } from './vo-sidenav.component';

describe('VoSidenavComponent', () => {
  let component: VoSidenavComponent;
  let fixture: ComponentFixture<VoSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoSidenavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
