import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import { File } from "../../common/models";
import {PaperCanvasComponent} from "../paper/paperCanvas.component";
import {ToolService} from "./tools.service";
import {combineLatest} from "rxjs/internal/observable/combineLatest";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/combineLatest';
import {MatDialog} from "@angular/material";
import {DrawingTool} from "../../common/paper/drawingTool.tool";
import {InheritRelationTool} from "../../classFile/tools/inheritRelation.tool";
import {NewClassTool} from "../../classFile/tools/newClass.tool";
import {AssocRelationTool} from "../../classFile/tools/assocRelation.tool";
import {SelectionTool} from "../../classFile/tools/selection.tool";
import {ConfirmDialogComponent} from "../components/confirm-dialog/confirm-dialog.component";
import {ClassFormComponent} from "./forms/class-form/class-form.component";
import {NgZone} from '@angular/core';
import {PaperService} from "../paper/paper.service";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [],
  providers: [
    ToolService,
    PaperService,

    SelectionTool,
    NewClassTool,
    AssocRelationTool,
    InheritRelationTool
  ]
})
export class EditorComponent implements OnInit {

  protected undoStack: File[] = [];
  private _file: File;
  @Input()
  set file(file: File) {
    if (file) {
      this._file = file;
      this.undoStack = [file];
    }
  }
  get file(): File {
    return this._file;
  }

  @ViewChild(PaperCanvasComponent)
  protected canvas: PaperCanvasComponent;

  public tools: DrawingTool[];

  constructor(public toolService: ToolService,
              protected paperService: PaperService){}

  ngOnInit() {
    this.paperService.hasInitialized.then(() => {
      this.tools = this.toolService.getTools();
    })
    // combineLatest (
    //   this.canvasService.getCanvas(this.canvasName),
    //   this.file$
    // ).subscribe((v: [ClassCanvasComponent, File]) => {
    //   this.canvas = v[0];
    //   this.canvas.data = v[1];
    // });

  }

  public addChange(data: File) {
    this.undoStack.unshift(data);
  }

  public undoChange() {
    if (this.undoStack.length > 1) {
      this.undoStack.shift();
    }
  }

  get activeTool() {
    return this.paperService.scope.tool;
  }

  activateTool(tool: DrawingTool) {
    tool.activate();
  }
}
