import {OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, InjectionToken} from '@angular/core';

import {Actions, ofActionSuccessful, Store} from "@ngxs/store";

import {combineLatest, concat, from, Subscription} from "rxjs";
import {ignoreElements, map, startWith, tap} from "rxjs/operators";

import {PaperService} from "./paper.service";
import {File, FileStateLike} from "../models";
import {DrawingTool} from "./drawingTool.tool";
import {ToolService} from "../services/tools.service";
import {DrawingService} from "../services/drawing.service";
import {AddToSelection, RemoveFromSelection, SetActiveFile, SetSelection} from "../../app/state/app.actions";
import {PatchClassMetaData} from "../../classFile/state/classFile.actions";
import {AddEntity, PatchEntity} from "../state/file.actions";

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
  private subscriptions: Subscription[] = [];
  @ViewChild('canvasElement') canvasElement: ElementRef;

  protected file: File;
  protected tools: DrawingTool[];

  constructor(protected paperService: PaperService,
              protected toolService: ToolService,
              protected drawingService: DrawingService,
              protected editorData: EDITOR_DATA_TYPE,
              protected store: Store,
              protected actions$: Actions) { }

  ngOnInit() {
    this.subscriptions.push(concat(
      from(this.paperService.hasInitialized).pipe(tap(() => {
        this.tools = this.toolService.getTools();
      }),ignoreElements()),
      combineLatest(
        this.actions$.pipe(ofActionSuccessful(SetActiveFile, SetSelection, AddToSelection, RemoveFromSelection,
          PatchEntity, PatchClassMetaData, AddEntity), startWith(true)),
        this.store.select(this.editorData.fileState.fileByKey).pipe(map(fn => fn(this.editorData.file_key)))
      ).pipe(map(([action, file]) => file))
    ).subscribe((file: File) => {
      this.file = file;
      this.draw(file);
    }));

    this.actions$.pipe(ofActionSuccessful(PatchEntity, PatchClassMetaData)).subscribe()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  draw(file) {
    if (file.entities) {
      console.log(`drawing file ${file.name}`);
      this.drawingService.draw(file);
    }
  }

  ngAfterViewInit() {
    this.paperService.initialize(this.canvasElement.nativeElement, this.editorData.file_key, {hitTolerance:2});
  }

  public clearCanvas() {
    this.paperService.project.clear();
  }

  get activeTool() {
    return this.paperService.scope.tool;
  }

  activateTool(tool: DrawingTool) {
    console.log(tool.activate());
    this.paperService.scope.tool = tool;
  }
}
