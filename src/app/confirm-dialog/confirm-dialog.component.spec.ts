import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import { ConfirmDialogComponent } from './confirm-dialog.component';
import {Component, Directive, NgModule, ViewChild, ViewContainerRef} from "@angular/core";
import {MatDialog, MatDialogModule} from "@angular/material";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {OverlayContainer} from "@angular/cdk/overlay";

describe('ConfirmDialogComponent', () => {
  let dialog: MatDialog;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DialogTestModule ],
    });

    TestBed.compileComponents();
  }));

  beforeEach(inject([MatDialog, OverlayContainer],
    (d: MatDialog, oc: OverlayContainer) => {
      dialog = d;
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    }));

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  beforeEach(() => {
    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainer);

    viewContainerFixture.detectChanges();
    testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
  });

  it('should create', () => {
    let dialogRef = dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'This is a test message'
      },
      viewContainerRef: testViewContainerRef
    });
    expect(dialogRef).toBeTruthy();
  });
});

@Directive({selector: 'dir-with-view-container'})
class DirectiveWithViewContainer {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

@Component({
  selector: 'arbitrary-component',
  template: `<dir-with-view-container></dir-with-view-container>`,
})
class ComponentWithChildViewContainer {
  @ViewChild(DirectiveWithViewContainer) childWithViewContainer: DirectiveWithViewContainer;

  get childViewContainer() {
    return this.childWithViewContainer.viewContainerRef;
  }
}

@NgModule({
  declarations: [
    ComponentWithChildViewContainer,
    DirectiveWithViewContainer,
    ConfirmDialogComponent
  ],
  exports: [
    ComponentWithChildViewContainer,
    DirectiveWithViewContainer
  ],
  imports: [
    MatDialogModule,
    NoopAnimationsModule
  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
})
class DialogTestModule {}
