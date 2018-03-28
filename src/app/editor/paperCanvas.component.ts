import {Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import { PaperScope, Project } from 'paper';

@Component({
  moduleId: module.id,
  selector: 'paper-canvas',
  template: '<canvas #canvasElement resize="true" height="400px" width="400px"></canvas>',
})

export class PaperCanvasComponent implements OnInit {
  @ViewChild('canvasElement') canvasElement: ElementRef;
  @Input() resize: boolean = false;

  scope: PaperScope;
  project: Project;

  constructor() { }

  ngOnInit() {
    this.scope = new PaperScope();
    this.project = new Project(this.canvasElement.nativeElement);
  }
}
