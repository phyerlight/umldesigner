import {OnInit, OnDestroy, ViewChild, ElementRef, Input, AfterViewInit, InjectionToken, Inject} from '@angular/core';
import {PaperService} from "./paper.service";
import {File} from "../models";
import {Store} from "@ngxs/store";
import {DrawingTool} from "./drawingTool.tool";
import {ToolService} from "../services/tools.service";
import {DrawingService} from "../services/drawing.service";
import {concat, from, Subscription} from "rxjs";
import {FileState} from "../state/file.state";
import {ignoreElements, map, take} from "rxjs/operators";

export const EDITOR_DATA = new InjectionToken<any>('EDITOR_DATA');

export type EDITOR_DATA_TYPE = {
  file_key: string
}

// @Component({
//   styles: ['canvas {width: 100%; height: 100%}'],
//   template: '<canvas #canvasElement resize></canvas>',
//   providers: [
//     PaperService
//   ]
// })
export abstract class PaperCanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  private fileSubscription: Subscription = null;
  @ViewChild('canvasElement') canvasElement: ElementRef;

  @Input() file: File;

  protected tools: DrawingTool[];

  constructor(protected paperService: PaperService,
              protected toolService: ToolService,
              protected drawingService: DrawingService,
              protected editorData: EDITOR_DATA_TYPE,
              protected store: Store) { }

  ngOnInit() {
    this.fileSubscription = concat(
      from(this.paperService.hasInitialized).pipe(take(1),ignoreElements()),
      // this.store.dispatch(new LoadFile(this.editorData.file_key)).pipe(take(1),ignoreElements()),
      this.store.select(FileState.fileByKey).pipe(map(fn => fn(this.editorData.file_key)))
    ).subscribe((file: File) => {
      this.tools = this.toolService.getTools();
      if (file.entities) {
        console.log(`drawing file ${file.name}`);
        this.drawingService.draw(file);
      }
    });
  }

  ngOnDestroy() {
    this.fileSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.paperService.initialize(this.canvasElement.nativeElement, this.editorData.file_key, {hitTolerance:1});
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
