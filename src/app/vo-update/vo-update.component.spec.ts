import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoUpdateComponent } from './vo-update.component';

describe('VoUpdateComponent', () => {
  let component: VoUpdateComponent;
  let fixture: ComponentFixture<VoUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
