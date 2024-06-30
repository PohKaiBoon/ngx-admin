import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullPageErrorComponent } from './full-page-error.component';

describe('FullPageErrorComponent', () => {
  let component: FullPageErrorComponent;
  let fixture: ComponentFixture<FullPageErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullPageErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullPageErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
