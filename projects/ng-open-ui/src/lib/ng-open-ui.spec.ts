import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgOpenUi } from './ng-open-ui';

describe('NgOpenUi', () => {
  let component: NgOpenUi;
  let fixture: ComponentFixture<NgOpenUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgOpenUi],
    }).compileComponents();

    fixture = TestBed.createComponent(NgOpenUi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
