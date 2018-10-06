import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Class, File, FileData, Relation} from "../file.service";
import {PaperCanvasComponent} from "./paperCanvas.component";
import {ToolService} from "./tools.service";
import {CanvasService} from "./canvas.service";
import {combineLatest} from "rxjs/internal/observable/combineLatest";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/combineLatest';
import {MatDialog} from "@angular/material";
import {DrawingTool} from "./tools/drawingTool.tool";
import {InheritRelationTool} from "./tools/inheritRelation.tool";
import {NewClassTool} from "./tools/newClass.tool";
import {AssocRelationTool} from "./tools/assocRelation.tool";
import {SelectionTool} from "./tools/selection.tool";
import {ConfirmDialogComponent} from "../confirm-dialog/confirm-dialog.component";
import Path = paper.Path;
import Point = paper.Point;
import PointText = paper.PointText;
import Group = paper.Group;
import Tool = paper.Tool;
import ToolEvent = paper.ToolEvent;
import {ClassFormComponent} from "./forms/class-form/class-form.component";
import {NgZone} from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [],
  providers: [
    ToolService,
    CanvasService,

    SelectionTool,
    NewClassTool,
    AssocRelationTool,
    InheritRelationTool
  ]
})
export class EditorComponent implements OnInit {

  protected undoStack: FileData[] = [];
  private _file: File;
  @Input()
  set file(file: File) {
    if (file) {
      this._file = file;
      this.undoStack = [file.data];
    }
  }
  get file(): File {
    return this._file;
  }

  @ViewChild(PaperCanvasComponent)
  protected canvas: PaperCanvasComponent;

  public tools: DrawingTool[];
  // protected canvasName = 'main';

  constructor(public toolService: ToolService){}
  // ,
  //             public canvasService: CanvasService) { }

  ngOnInit() {
    this.tools = this.toolService.getTools();
    // combineLatest (
    //   this.canvasService.getCanvas(this.canvasName),
    //   this.file$
    // ).subscribe((v: [ClassCanvasComponent, File]) => {
    //   this.canvas = v[0];
    //   this.canvas.data = v[1];
    // });

  }

  public addChange(data: FileData) {
    this.undoStack.unshift(data);
  }

  public undoChange() {
    if (this.undoStack.length > 1) {
      this.undoStack.shift();
    }
  }

  get activeTool() {
    return this.canvas.scope.tool;
  }

  activateTool(tool: DrawingTool) {
    tool.activate();
  }
}
