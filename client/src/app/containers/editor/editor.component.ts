import {ChangeDetectionStrategy, Component, Injector, OnInit} from '@angular/core';
import {ComponentPortal, ComponentType} from "@angular/cdk/portal";
import {Select, Store} from "@ngxs/store";
import {Navigate} from "@ngxs/router-plugin";
import {Observable} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";

import {AppState, EditorTabData} from "../../state/app.state";
import {ProjectState} from "../../state/project.state";
import {CloseFile} from "../../state/app.actions";

import {File, FileTypeOptions} from "../../../common/models";
import {EDITOR_DATA} from "../../../common/paper/paperCanvas.component";
import {FileState} from "../../../common/state/file.state";

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
