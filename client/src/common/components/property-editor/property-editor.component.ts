import {
  AfterViewInit,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChildren
} from '@angular/core';
import {PropertyItem} from "./PropertyItem";
import {InputDirective} from "./input.directive";
import {debounceTime} from "rxjs/operators";

@Component({
  selector: 'property-editor',
  templateUrl: './property-editor.component.html',
  styleUrls: ['./property-editor.component.scss']
})
export class PropertyEditorComponent implements AfterViewInit {

  @Input()
  properties: PropertyItem[];

  private _objects: any[];
  @Input()
  set objects(o: any[]) {
    this._objects = o;
    this.setInputs();
  }
  get objects() {
    return this._objects;
  }

  @Output()
  valueChanged = new EventEmitter();

  @ViewChildren(InputDirective)
  inputs: QueryList<InputDirective>;

  constructor() { }

  ngAfterViewInit() {
    this.inputs.changes.subscribe(() => {
      this.inputs.forEach(propInput => {
        propInput.inputChanged.pipe(debounceTime(500)).subscribe((evt: MouseEvent) => {
          this.setValue(propInput.name, (evt.target as HTMLInputElement).value);
        });
        propInput.setValue(this.getValue(propInput.name));
      });
    });
  }

  setInputs() {
    if (!this.inputs) return;
    this.inputs.forEach(propInput => {
      propInput.setValue(this.getValue(propInput.name));
    });
  }

  getValue(key: string): string {
    if (this.objects.length < 1) return "";
    return this.objects.map(v => v[key]).reduce((acc, curr) => {
      if (acc === curr) {
        return acc;
      } else {
        return null;
      }
    });
  }

  setValue(key: string, value) {
    this.valueChanged.emit({
      key,
      value
    });
  }

}
