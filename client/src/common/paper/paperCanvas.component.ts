import {Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit} from '@angular/core';
import { PaperScope, Project } from 'paper';
import {PaperService} from "./paper.service";

// @Component({
//   styles: ['canvas {width: 100%; height: 100%}'],
//   template: '<canvas #canvasElement resize></canvas>',
//   providers: [
//     PaperService
//   ]
// })
export abstract class PaperCanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasElement') canvasElement: ElementRef;

  @Input() fileKey: string;

  @Input() name: string;
  @Input() data: any;

  constructor(protected paperService: PaperService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.paperService.initialize(this.canvasElement.nativeElement, this.fileKey, {hitTolerance:1});
  }

  public clearCanvas() {
    this.paperService.project.clear();
  }
}
