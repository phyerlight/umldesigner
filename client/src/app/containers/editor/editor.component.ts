import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import {File, FileType} from "../../../common/models";
import {PaperCanvasComponent} from "../../../common/paper/paperCanvas.component";
import {combineLatest} from "rxjs/internal/observable/combineLatest";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/combineLatest';
import {MatDialog} from "@angular/material";
import {DrawingTool} from "../../../common/paper/drawingTool.tool";
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";
import {ClassFormComponent} from "../../../classFile/components/class-form/class-form.component";
import {NgZone} from '@angular/core';
import {PaperService} from "../../../common/paper/paper.service";
import {CdkPortal, ComponentPortal} from "@angular/cdk/portal";
import {ClassCanvasComponent} from "../../../classFile/components/classCanvas/classCanvas.component";
import {AppState} from "../../state/app.state";
import {Select, Store} from "@ngxs/store";
import {Navigate} from "@ngxs/router-plugin";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [],
  providers: []
})
export class EditorComponent implements OnInit {

  @Select(state => state.app.editor)
  protected editorMeta;

  @Select(state => state.app.editorTabs)
  protected editorData;

  // protected undoStack: File[] = [];
  private _file: File;
  @Input()
  // file: File;
  set file(file: File) {
    if (file) {
      this._file = file;

      this.canvasPortal = new ComponentPortal(FileType[file.type].editor);
      // this.canvasPortal = new ComponentPortal(ClassCanvasComponent);
      console.log(this.canvasPortal);
    }
  }
  get file(): File {
    return this._file;
  }

  protected canvasPortal;

  // public tools: DrawingTool[];

  constructor(protected store: Store){}

  selectTab(fileKey: string) {
    this.store.dispatch(new Navigate([]));
  }

  ngOnInit() {
    // this.paperService.hasInitialized.then(() => {
    //   this.tools = this.toolService.getTools();
    //   this.paperService.scope.activate();
    // })
    // combineLatest (
    //   this.canvasService.getCanvas(this.canvasName),
    //   this.file$
    // ).subscribe((v: [ClassCanvasComponent, File]) => {
    //   this.canvas = v[0];
    //   this.canvas.data = v[1];
    // });

  }

  // public addChange(data: File) {
  //   this.undoStack.unshift(data);
  // }
  //
  // public undoChange() {
  //   if (this.undoStack.length > 1) {
  //     this.undoStack.shift();
  //   }
  // }
  //
}
