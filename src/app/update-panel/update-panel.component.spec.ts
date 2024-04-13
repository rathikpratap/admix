import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePanelComponent } from './update-panel.component';

describe('UpdatePanelComponent', () => {
  let component: UpdatePanelComponent;
  let fixture: ComponentFixture<UpdatePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
