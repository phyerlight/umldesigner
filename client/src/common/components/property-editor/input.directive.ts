import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
  selector: '[appInput]'
})
export class InputDirective {

  @Output()
  inputChanged = new EventEmitter();

  @Input()
  name: string;

  constructor(protected el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event) {
    this.inputChanged.emit(event);
  }

  setValue(v) {
    this.el.nativeElement.value = v;
  }

}
