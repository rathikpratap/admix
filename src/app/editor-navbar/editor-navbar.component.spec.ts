import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorNavbarComponent } from './editor-navbar.component';

describe('EditorNavbarComponent', () => {
  let component: EditorNavbarComponent;
  let fixture: ComponentFixture<EditorNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
