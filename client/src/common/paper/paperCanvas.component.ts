import {OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, InjectionToken} from '@angular/core';

import {Store} from "@ngxs/store";

import {concat, from, Subscription} from "rxjs";
import {ignoreElements, map, tap} from "rxjs/operators";

import {PaperService} from "./paper.service";
import {File} from "../models";
import {DrawingTool} from "./drawingTool.tool";
import {ToolService} from "../services/tools.service";
import {DrawingService} from "../services/drawing.service";
import {FileStateLike} from "../models/FileStateLike";

export const EDITOR_DATA = new InjectionToken<any>('EDITOR_DATA');

export type EDITOR_DATA_TYPE = {
  file_key: string,
  fileState: typeof FileStateLike
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

  protected file: File;
  protected tools: DrawingTool[];

  constructor(protected paperService: PaperService,
              protected toolService: ToolService,
              protected drawingService: DrawingService,
              protected editorData: EDITOR_DATA_TYPE,
              protected store: Store) { }

  ngOnInit() {
    this.fileSubscription = concat(
      from(this.paperService.hasInitialized).pipe(tap(() => {
        this.tools = this.toolService.getTools();
      }),ignoreElements()),
      this.store.select(this.editorData.fileState.fileByKey).pipe(map(fn => fn(this.editorData.file_key)))
    ).subscribe((file: File) => {
      this.file = file;
      this.draw(file);
    });
  }

  ngOnDestroy() {
    this.fileSubscription.unsubscribe();
  }

  draw(file) {
    if (file.entities) {
      console.log(`drawing file ${file.name}`);
      this.drawingService.draw(file);
    }
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
    this.paperService.scope.tool = tool;
  }
}
