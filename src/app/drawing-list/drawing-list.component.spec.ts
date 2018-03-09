import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingListComponent } from './drawing-list.component';
import {MatExpansionModule, MatIconModule, MatListModule} from "@angular/material";
import {RouterTestingModule} from "@angular/router/testing";
import {Routes} from "@angular/router";
import {Component} from "@angular/core";

describe('DrawingListComponent', () => {
  let component: DrawingListComponent;
  let fixture: ComponentFixture<DrawingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatExpansionModule, MatIconModule, MatListModule,
        RouterTestingModule.withRoutes(routes)
      ],
      declarations: [
        DrawingListComponent, AppComponentStub
      ]

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

@Component({
  selector: 'app-root',
  template: '<h1>UML Designer</h1>'
})
class AppComponentStub {
  constructor() { }
}

const routes: Routes = [
  { path: '', component: AppComponentStub},
];
