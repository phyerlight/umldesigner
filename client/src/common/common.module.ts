import { NgModule } from '@angular/core';
import { CommonModule as AngularCommon } from '@angular/common';
import { PropertyEditorComponent } from './components/property-editor/property-editor.component';
import { InputDirective } from './components/property-editor/input.directive';

@NgModule({
  imports: [
    AngularCommon
  ],
  declarations: [
    PropertyEditorComponent,
    InputDirective
  ],
  exports: [
    PropertyEditorComponent
  ]
})
export class CommonModule { }
