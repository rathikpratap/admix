import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesWorkComponent } from './sales-work.component';

describe('SalesWorkComponent', () => {
  let component: SalesWorkComponent;
  let fixture: ComponentFixture<SalesWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesWorkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
