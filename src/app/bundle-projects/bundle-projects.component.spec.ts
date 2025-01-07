import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BundleProjectsComponent } from './bundle-projects.component';

describe('BundleProjectsComponent', () => {
  let component: BundleProjectsComponent;
  let fixture: ComponentFixture<BundleProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BundleProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BundleProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
