import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletWrapperComponent } from './outlet-wrapper.component';
import {RouterTestingModule} from "@angular/router/testing";
import {Component} from "@angular/core";
import {Routes} from "@angular/router";

@Component({
  selector: 'app-root',
  template: '<h1>UML Designer</h1>'
})
class AppComponent {
  constructor() { }
}

const routes: Routes = [
  { path: '', component: AppComponent}
];

describe('OutletWrapperComponent', () => {
  let component: OutletWrapperComponent;
  let fixture: ComponentFixture<OutletWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OutletWrapperComponent,
        AppComponent
      ],
      imports: [
        RouterTestingModule.withRoutes(routes)
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
