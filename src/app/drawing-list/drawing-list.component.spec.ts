import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingListComponent } from './drawing-list.component';

describe('DrawingListComponent', () => {
  let component: DrawingListComponent;
  let fixture: ComponentFixture<DrawingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
