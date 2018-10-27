import {Action, Selector, State, StateContext} from '@ngxs/store';
import {CancelEditClass, EditClass, SaveEditClass, SetActiveFile, SetSelection} from "./app.actions";
import {User} from "../models/User";

export interface AppStateModel {
  editor: {
    activeTool: string
  },
  selection: {
    fileKey: string,
    entityIds: number[]
  }
  clsEditor: {
    fileKey: string,
    cls: any
  },
  user: User
}

@State<AppStateModel>({
  name: "app",
  defaults: {
    editor: {
      activeTool: null
    },
    selection: {
      fileKey: null,
      entityIds: []
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
  static isEntitySelected(app: AppStateModel) {
    return (fileKey:string, entityId: number) => {
      if (app.selection.fileKey != fileKey) return false;
      return app.selection.entityIds.find((v) => v == entityId) != undefined;
    }
  }

  @Action(SetSelection)
  setSelection(ctx: StateContext<AppStateModel>, action: SetSelection) {
    const app = ctx.getState();

    ctx.setState({
      ...app,
      selection: {
        ...app.selection,
        entityIds: action.entityIds
      }
    });
  }

  @Action(SetActiveFile)
  setActiveFile(ctx: StateContext<AppStateModel>, action: SetActiveFile) {
    const app = ctx.getState();

    if (app.selection.fileKey == action.fileKey) return;

    ctx.setState({
      ...app,
      selection: {
        fileKey: action.fileKey,
        entityIds: []
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

    const {fileKey} = state.clsEditor

    const cls = {
      ...action.cls,
      id: state.clsEditor.cls.id
    }

    // ctx.dispatch(new PatchClass(fileKey, cls));

    ctx.setState({
      ...state,
      clsEditor: null
    });
  }

}
