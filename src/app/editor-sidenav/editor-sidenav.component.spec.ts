import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSidenavComponent } from './editor-sidenav.component';

describe('EditorSidenavComponent', () => {
  let component: EditorSidenavComponent;
  let fixture: ComponentFixture<EditorSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorSidenavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
