import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScriptUpdateComponent } from './script-update.component';

describe('ScriptUpdateComponent', () => {
  let component: ScriptUpdateComponent;
  let fixture: ComponentFixture<ScriptUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScriptUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScriptUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
