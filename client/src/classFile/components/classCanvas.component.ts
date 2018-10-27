import {Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit} from '@angular/core';
import {PaperService} from "../../common/paper/paper.service";
import {PaperCanvasComponent} from "../../common/paper/paperCanvas.component";

@Component({
  styles: ['canvas {width: 100%; height: 100%}'],
  selector: 'class-canvas',
  template: '<canvas #canvasElement resize></canvas>',
  providers: [
    PaperService
  ]
})
export class ClassCanvasComponent extends PaperCanvasComponent implements OnInit, AfterViewInit {

  constructor(protected paperService: PaperService) {
    super(paperService);
  }

}
