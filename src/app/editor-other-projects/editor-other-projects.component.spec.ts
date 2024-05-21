import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorOtherProjectsComponent } from './editor-other-projects.component';

describe('EditorOtherProjectsComponent', () => {
  let component: EditorOtherProjectsComponent;
  let fixture: ComponentFixture<EditorOtherProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorOtherProjectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorOtherProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
