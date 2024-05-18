import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptProjectsComponent } from './script-projects.component';

describe('ScriptProjectsComponent', () => {
  let component: ScriptProjectsComponent;
  let fixture: ComponentFixture<ScriptProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScriptProjectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScriptProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
