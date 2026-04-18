import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsKitchenSink } from './components-kitchen-sink';

describe('ComponentsKitchenSink', () => {
  let component: ComponentsKitchenSink;
  let fixture: ComponentFixture<ComponentsKitchenSink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentsKitchenSink],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentsKitchenSink);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
