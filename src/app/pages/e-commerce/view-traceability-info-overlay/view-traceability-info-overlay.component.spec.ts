import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTraceabilityInfoOverlayComponent } from './view-traceability-info-overlay.component';

describe('ViewTraceabilityInfoOverlayComponent', () => {
  let component: ViewTraceabilityInfoOverlayComponent;
  let fixture: ComponentFixture<ViewTraceabilityInfoOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTraceabilityInfoOverlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTraceabilityInfoOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
