import {OnInit, ViewChild, ElementRef, Input, AfterViewInit} from '@angular/core';
import {PaperService} from "./paper.service";
import {File} from "../models";
import {Store} from "@ngxs/store";
import {DrawingTool} from "./drawingTool.tool";
import {ToolService} from "../services/tools.service";
import {DrawingService} from "../services/drawing.service";


// @Component({
//   styles: ['canvas {width: 100%; height: 100%}'],
//   template: '<canvas #canvasElement resize></canvas>',
//   providers: [
//     PaperService
//   ]
// })
export abstract class PaperCanvasComponent implements OnInit, AfterViewInit {
  @ViewChild('canvasElement') canvasElement: ElementRef;

  @Input() file: File;

  protected tools: DrawingTool[];

  constructor(protected paperService: PaperService,
              protected toolService: ToolService,
              protected drawingService: DrawingService) { }

  ngOnInit() {
    this.paperService.hasInitialized.then(() => {
      this.tools = this.toolService.getTools();

      this.drawingService.draw(this.file);
    });
  }

  ngAfterViewInit() {
    this.paperService.initialize(this.canvasElement.nativeElement, this.file._key, {hitTolerance:1});
  }

  public clearCanvas() {
    this.paperService.project.clear();
  }

  get activeTool() {
    return this.paperService.scope.tool;
  }

  activateTool(tool: DrawingTool) {
    tool.activate();
  }
}
