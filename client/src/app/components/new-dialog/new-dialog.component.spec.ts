import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import { NewDialogComponent } from './new-dialog.component';
import {MatDialog, MatDialogModule, MatDialogRef, MatInputModule} from "@angular/material";
import {ReactiveFormsModule} from "@angular/forms";
import {Component, Directive, NgModule, ViewChild, ViewContainerRef} from "@angular/core";
import {OverlayContainer} from "@angular/cdk/overlay";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";

declare var spyOn: any;

describe('NewDialogComponent', () => {
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
    let dialogRef = dialog.open(NewDialogComponent, {
      data: {
        type: 'test',
        message: ''
      },
      viewContainerRef: testViewContainerRef
    });
    expect(dialogRef).toBeTruthy();
  });

  it('should have an invalid form with invalid name', () => {
    let dialogRef = dialog.open(NewDialogComponent, {
      data: {
        type: 'test',
        message: ''
      },
      viewContainerRef: testViewContainerRef
    });
    viewContainerFixture.detectChanges();
    let input = overlayContainerElement.querySelector('input');
    let form = dialogRef.componentInstance.form;

    //invalid characters: ^&'"\/()[\]?{}]+$
    input.value = 'bah';
    input.dispatchEvent(new Event('input'));
    viewContainerFixture.detectChanges();
    expect(form.valid).toBeTruthy('found valid input to be invalid');

    ['&', "'", '"', "\\", '/', '(', ')', '[', ']', '?', '{', '}'].forEach(char => {
      input.value = 'bah'+char+'asdf';
      input.dispatchEvent(new Event('input'));
      viewContainerFixture.detectChanges();
      expect(form.invalid).toBeTruthy(`Didn't find character '${char}' to be invalid`);
    });

    input.value = '';
    input.dispatchEvent(new Event('input'));
    viewContainerFixture.detectChanges();
    expect(form.invalid).toBeTruthy(`Didn't register required validation on empty string`);

  });

  it('should not let the item be created if invalid', () => {
    let dialogRef = dialog.open(NewDialogComponent, {
      data: {
        type: 'test',
        message: ''
      },
      viewContainerRef: testViewContainerRef
    });
    viewContainerFixture.detectChanges();
    let input = overlayContainerElement.querySelector('input');
    let createBtn: Element = overlayContainerElement.querySelector('button[type="submit"]');
    input.value = 'bah&';
    input.dispatchEvent(new Event('input'));
    viewContainerFixture.detectChanges();

    expect(createBtn.attributes['disabled']).toBeTruthy("button isn't disabled with invalid form");

    dialogRef.componentInstance.close(input.value);
    expect(dialog.openDialogs.length).toBe(1);

    input.value = 'bah';
    input.dispatchEvent(new Event('input'));
    viewContainerFixture.detectChanges();

    expect(createBtn.attributes['disabled']).toBeFalsy("button is disabled with valid form");

    let spy: jasmine.Spy = spyOn(dialogRef.componentInstance, 'close').and.callThrough();
    createBtn.dispatchEvent(new Event('click'));

    expect(spy.calls.count()).toBe(1, "Close did not get triggered");
  });

  it('should let the form be canceled regardless', () => {
    let dialogRef = dialog.open(NewDialogComponent, {
      data: {
        type: 'test',
        message: ''
      },
      viewContainerRef: testViewContainerRef
    });
    viewContainerFixture.detectChanges();
    let input = overlayContainerElement.querySelector('input');
    let cancelBtn: Element = overlayContainerElement.querySelector('button[type="button"]');
    input.value = 'bah&';
    input.dispatchEvent(new Event('input'));
    viewContainerFixture.detectChanges();

    expect(cancelBtn.attributes['disabled']).toBeFalsy("button is disabled with invalid form");

    let spy = spyOn(dialogRef.componentInstance, 'close').and.callThrough();
    cancelBtn.dispatchEvent(new Event('click'));

    expect(spy.calls.count()).toBe(1, "Close did not get triggered");
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
    NewDialogComponent
  ],
  exports: [
    ComponentWithChildViewContainer,
    DirectiveWithViewContainer
  ],
  imports: [
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    NoopAnimationsModule
  ],
  entryComponents: [
    NewDialogComponent
  ],
})
class DialogTestModule {}
