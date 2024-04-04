import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptHomeComponent } from './script-home.component';

describe('ScriptHomeComponent', () => {
  let component: ScriptHomeComponent;
  let fixture: ComponentFixture<ScriptHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScriptHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScriptHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
