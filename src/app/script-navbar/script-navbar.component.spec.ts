import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptNavbarComponent } from './script-navbar.component';

describe('ScriptNavbarComponent', () => {
  let component: ScriptNavbarComponent;
  let fixture: ComponentFixture<ScriptNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScriptNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScriptNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
