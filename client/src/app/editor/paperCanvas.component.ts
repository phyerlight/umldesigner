import {Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit} from '@angular/core';
import { PaperScope, Project } from 'paper';
import {CanvasService} from "./canvas.service";

@Component({
  moduleId: module.id,
  styles: ['canvas {width: 100%; height: 100%}'],
  selector: 'paper-canvas',
  template: '<canvas #canvasElement resize></canvas>',
  providers: []
})
export class PaperCanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasElement') canvasElement: ElementRef;

  @Input() name: string;
  @Input() data: any;

  scope: PaperScope;
  project: Project;

  constructor(protected canvasService: CanvasService) { }

  ngOnInit() {
    this.scope = window['paper'];
    this.scope.settings['insertItems'] = false;
    this.scope.settings['applyMatrix'] = false;
    this.scope.settings['hitTolerance'] = 1;
  }

  ngAfterViewInit() {
    this.scope.setup(this.canvasElement.nativeElement);
    this.project = this.scope.project;
    this.canvasService.registerCanvas(this, this.name);
  }

  public clearCanvas() {
    this.project.clear();
  }
}
