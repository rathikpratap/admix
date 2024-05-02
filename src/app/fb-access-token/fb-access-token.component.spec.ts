import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FbAccessTokenComponent } from './fb-access-token.component';

describe('FbAccessTokenComponent', () => {
  let component: FbAccessTokenComponent;
  let fixture: ComponentFixture<FbAccessTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FbAccessTokenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FbAccessTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
