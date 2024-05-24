import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorB2bUpdateComponent } from './editor-b2b-update.component';

describe('EditorB2bUpdateComponent', () => {
  let component: EditorB2bUpdateComponent;
  let fixture: ComponentFixture<EditorB2bUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorB2bUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorB2bUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
