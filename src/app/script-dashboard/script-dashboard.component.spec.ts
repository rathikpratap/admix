import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptDashboardComponent } from './script-dashboard.component';

describe('ScriptDashboardComponent', () => {
  let component: ScriptDashboardComponent;
  let fixture: ComponentFixture<ScriptDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScriptDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScriptDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
