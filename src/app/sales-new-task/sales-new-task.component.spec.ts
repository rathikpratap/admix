import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesNewTaskComponent } from './sales-new-task.component';

describe('SalesNewTaskComponent', () => {
  let component: SalesNewTaskComponent;
  let fixture: ComponentFixture<SalesNewTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesNewTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesNewTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
