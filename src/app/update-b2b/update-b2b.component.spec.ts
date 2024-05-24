import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateB2bComponent } from './update-b2b.component';

describe('UpdateB2bComponent', () => {
  let component: UpdateB2bComponent;
  let fixture: ComponentFixture<UpdateB2bComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateB2bComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateB2bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
