import {ChangeDetectionStrategy, Component, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {File, FileType, FileTypeOptions} from "../../../common/models";
import {EDITOR_DATA, PaperCanvasComponent} from "../../../common/paper/paperCanvas.component";
import {combineLatest} from "rxjs/internal/observable/combineLatest";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/combineLatest';
import {MatDialog} from "@angular/material";
import {DrawingTool} from "../../../common/paper/drawingTool.tool";
import {ConfirmDialogComponent} from "../../components/confirm-dialog/confirm-dialog.component";
import {ClassFormComponent} from "../../../classFile/components/class-form/class-form.component";
import {NgZone} from '@angular/core';
import {PaperService} from "../../../common/paper/paper.service";
import {CdkPortal, ComponentPortal, ComponentType} from "@angular/cdk/portal";
import {ClassCanvasComponent} from "../../../classFile/components/classCanvas/classCanvas.component";
import {AppState, EditorTabData} from "../../state/app.state";
import {Select, Store} from "@ngxs/store";
import {Navigate} from "@ngxs/router-plugin";
import {FileState} from "../../../common/state/file.state";
import {distinctUntilChanged, map} from "rxjs/operators";
import {Observable} from "rxjs";
import {ProjectState} from "../../state/project.state";
import {CloseFile} from "../../state/app.actions";

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
  protected editorMeta$;

  @Select(AppState.editorTabData)
  protected editorTabData$: Observable<EditorTabData[]>;

  @Select(state => state.app.editor.activeKey)
  protected file_key$: Observable<string>;
  protected canvasPortal;

  constructor(protected store: Store){}

  selectTab(file: File) {
    let project = this.store.selectSnapshot(ProjectState)[file.project_key];
    this.store.dispatch(new Navigate([project.name,file.name]));
  }

  closeTab(tab: EditorTabData) {
    if (tab.dirty) {

    }
    let actions = [new CloseFile(tab.file._key)];
    if (tab.active) {} //TODO navigate to next active tab
    this.store.dispatch(actions);
  }

  ngOnInit() {
    this.file_key$.pipe(distinctUntilChanged()).subscribe(file_key => {
      if (file_key) {

        let fileType: FileTypeOptions = this.store.selectSnapshot(FileState.fileType)(file_key);
        let injector = Injector.create({providers: [
          {provide: EDITOR_DATA,
            useValue: {
              file_key,
              fileState: fileType.state
            }
          }
        ]});
        console.log(`making a new editor portal with key ${file_key}`);
        this.canvasPortal = new ComponentPortal(fileType.editor as unknown as ComponentType<any>, null, injector);
      } else {
        this.canvasPortal = null;
      }

    });

  }

}
