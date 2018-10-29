import {Action, Selector, State, StateContext} from '@ngxs/store';
import {CancelEditClass, EditClass, SaveEditClass, SetActiveFile, SetSelection} from "./app.actions";
import {User} from "../models/User";

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
      tabOrder: null
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
      return app.editorTabs[fileKey].selection.find((v) => v == entityId) != undefined;
    }
  }

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

    if (app.editor.activeKey == action.fileKey) return;

    ctx.setState({
      ...app,
      editor: {
        ...app.editor,
        activeKey: action.fileKey,
      }
    });
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

    // ctx.dispatch(new PatchClass(fileKey, cls));

    ctx.setState({
      ...state,
      clsEditor: null
    });
  }

}
