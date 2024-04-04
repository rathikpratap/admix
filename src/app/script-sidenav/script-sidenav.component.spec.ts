import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptSidenavComponent } from './script-sidenav.component';

describe('ScriptSidenavComponent', () => {
  let component: ScriptSidenavComponent;
  let fixture: ComponentFixture<ScriptSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScriptSidenavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScriptSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
