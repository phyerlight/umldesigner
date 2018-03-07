import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletWrapperComponent } from './outlet-wrapper.component';
import {RouterModule} from "@angular/router";

describe('OutletWrapperComponent', () => {
  let component: OutletWrapperComponent;
  let fixture: ComponentFixture<OutletWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletWrapperComponent ],
      imports: [
        RouterModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
