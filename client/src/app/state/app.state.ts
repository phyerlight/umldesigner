import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {
  CancelEditClass,
  CloseFile,
  EditClass,
  OpenFile,
  SaveEditClass,
  SetActiveFile,
  SetSelection
} from "./app.actions";
import {User} from "../models/User";
import {FileState} from "../../common/state/file.state";
import {filesByKey} from "../../common";
import {File} from "../../common/models";
import {Navigate} from "@ngxs/router-plugin";
import {NavigateByKey} from "../services/appRouter.plugin";
import {GlobalFileStateModel} from "../../common/models/GlobalFileStateModel";

export type EditorTabData = {
  active: boolean,
  file: File,
  dirty: boolean
}

export interface AppStateModel {
  editorTabs: {
    [fileKey: string]: {
      activeTool: string,
      selection: number[],
      undo: File[]
    }
  },
  editor: {
    activeKey: string,
    tabOrder: string[]
  },
  clsEditor: {
    fileKey: string,
    cls: any
  },
  user: User
}

@State<AppStateModel>({
  name: "app",
  defaults: {
    editorTabs: {},
    editor: {
      activeKey: null,
      tabOrder: []
    },
    clsEditor: null,
    user: null
  }
})
export class AppState {

  @Selector()
  static clsEditor(state: AppStateModel) {
    return state.clsEditor;
  }

  @Selector()
  static isEntitySelected(app: AppStateModel){
    return (fileKey:string, entityId: number): boolean => {
      if (app.editor.activeKey != fileKey) return false;
      return app.editorTabs[fileKey].selection.find((v: number) => v == entityId) != undefined;
    }
  }

  @Selector([FileState])
  static activeFile(appState: AppStateModel, state: GlobalFileStateModel) {
    return state[Object.keys(state).find(t => state[t][appState.editor.activeKey] != null)][appState.editor.activeKey];
  }

  @Selector([FileState])
  static selectedEntity(appState: AppStateModel, files: GlobalFileStateModel) {
    if (appState.editor.activeKey == null ||
      appState.editorTabs[appState.editor.activeKey].selection.length < 1) {
      return null;
    }

    let f: File = filesByKey(files, appState.editor.activeKey);
    let i = appState.editor[appState.editor.activeKey].selection[0];
    return f.entities[i];
  }

  @Selector([FileState])
  static editorTabData(app: AppStateModel, files: GlobalFileStateModel): EditorTabData[] {
    let tabFiles = filesByKey(files, app.editor.tabOrder);
    return tabFiles.map((file, index) => {
      return {
        active: app.editor.activeKey == file._key,
        file,
        dirty: app.editorTabs[file._key].undo[0] != file
      }
    });
  }

  @Selector()
  static isFileOpen(app: AppStateModel) {
    return (key: string): boolean => {
      return app.editorTabs[key] != null;
    }
  }

  constructor(protected store: Store) {}

  @Action(SetSelection)
  setSelection(ctx: StateContext<AppStateModel>, action: SetSelection) {
    const app = ctx.getState();

    ctx.setState({
      ...app,
      editorTabs:{
        ...app.editorTabs,
        [app.editor.activeKey]: {
          ...app.editorTabs[app.editor.activeKey],
          selection: action.entityIds
        }
      }
    });
  }

  @Action(SetActiveFile)
  setActiveFile(ctx: StateContext<AppStateModel>, action: SetActiveFile) {
    const app = ctx.getState();

    ctx.setState({
      ...app,
      editor: {
        ...app.editor,
        activeKey: action.fileKey,
      }
    });
  }

  @Action(OpenFile)
  openFile(ctx: StateContext<AppStateModel>, action: OpenFile) {
    const app = ctx.getState();

    let editorTabs = app.editorTabs;

    let file = this.store.selectSnapshot(FileState.fileByKey)(action.fileKey);

    if (!editorTabs[action.fileKey]) {
      editorTabs = {
        ...editorTabs,
        [action.fileKey]: {
          activeTool: null,
          selection: [],
          undo: [file]
        }
      };
    }

    let tabOrder = app.editor.tabOrder;
    if (tabOrder.indexOf(action.fileKey)==-1) {
      tabOrder = [...tabOrder, action.fileKey];
    }

    ctx.setState({
      ...app,
      editorTabs,
      editor: {
        ...app.editor,
        tabOrder
      }
    });
  }

  @Action(CloseFile)
  closeFile(ctx: StateContext<AppStateModel>, {fileKey}: CloseFile) {
    const app: AppStateModel = ctx.getState();

    let editorTabs = {
      ...app.editorTabs
    };
    delete editorTabs[fileKey];

    let activeKey = app.editor.activeKey;
    // let activeKey = null;
    let action = null;
    if (app.editor.activeKey == fileKey){
      if (app.editor.tabOrder.length > 1) {
        // set new active tab to the one before it in the list of editors.
        let i = app.editor.tabOrder.indexOf(fileKey) - 1;
        if (i < 0) {
          i = 1;
        }
        action = new NavigateByKey(app.editor.tabOrder[i]);
        // activeKey = app.editor.tabOrder[i];
      } else {
        action = new Navigate(['']);
        activeKey = null;
      }
    }

    let tabOrder = app.editor.tabOrder.filter(v=>v!=fileKey);

    ctx.setState({
      ...app,
      editorTabs,
      editor: {
        activeKey,
        tabOrder
      }
    });

    if (action) {
      return ctx.dispatch(action);
    }
  }

  @Action(EditClass)
  startEditClass(ctx: StateContext<AppStateModel>, action: EditClass) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      clsEditor: {...action}
    });
  }

  @Action(CancelEditClass)
  cancelEditClass(ctx: StateContext<AppStateModel>) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      clsEditor: null
    })
  }

  @Action(SaveEditClass)
  saveEditClass(ctx: StateContext<AppStateModel>, action: SaveEditClass) {
    const state = ctx.getState();

    const {fileKey} = state.clsEditor;

    const cls = {
      ...action.cls,
      id: state.clsEditor.cls.id
    };

    ctx.setState({
      ...state,
      clsEditor: null
    });
  }

}
