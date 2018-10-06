import {Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit} from '@angular/core';
import { PaperScope, Project } from 'paper';
import {CanvasService} from "./canvas.service";
import {PaperService} from "../paper.service";

@Component({
  moduleId: module.id,
  styles: ['canvas {width: 100%; height: 100%}'],
  selector: 'paper-canvas',
  template: '<canvas #canvasElement resize></canvas>',
  providers: [
    PaperService
  ]
})
export class PaperCanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasElement') canvasElement: ElementRef;

  @Input() fileKey: string;

  @Input() name: string;
  @Input() data: any;

  scope: PaperScope;
  project: Project;

  constructor(protected paperService: PaperService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.paperService.initialize(this.canvasElement.nativeElement, this.fileKey, {hitTolerance:1});
  }

  public clearCanvas() {
    this.project.clear();
  }
}
