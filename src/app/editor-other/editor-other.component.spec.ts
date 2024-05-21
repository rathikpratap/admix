import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorOtherComponent } from './editor-other.component';

describe('EditorOtherComponent', () => {
  let component: EditorOtherComponent;
  let fixture: ComponentFixture<EditorOtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorOtherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
