import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlKitchenSink } from './html-kitchen-sink';

describe('HtmlKitchenSink', () => {
  let component: HtmlKitchenSink;
  let fixture: ComponentFixture<HtmlKitchenSink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HtmlKitchenSink],
    }).compileComponents();

    fixture = TestBed.createComponent(HtmlKitchenSink);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
