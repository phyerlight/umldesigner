import {Action, Selector, State, StateContext} from '@ngxs/store';

import {AppState, AppStateModel} from '../../app/state/app.state';

import {AddFile} from './file.actions';
import {File, FileStateModel, FileType} from "../models";

export let AllFileStates = [];
Object.keys(FileType).forEach(t => {
    AllFileStates.push(FileType[t].state);
});

export interface GlobalFileStateModel {
    [fileType: string]: FileStateModel
}

@State<GlobalFileStateModel>({
  name: "files",
  defaults: {},
  children: AllFileStates
})
export class FileState {

  @Selector([AppState])
  static activeFile(state: FileStateModel, appState: AppStateModel) {
    return state[appState.editorTab]
  }

  @Selector()
  static fileByKey(state: FileStateModel) {
    return (key: string) => {
      return state[key];
    }
  }

  @Selector([AppState])
  static selectedEntity(files: FileStateModel, appState: AppStateModel) {
    if (appState.editor[appState.editorTab].selection.length < 1 ||
      appState.editorTab == null) {
      return null;
    }

    let f: File = files[appState.editorTab];
    let i = appState.editor[appState.editorTab].selection[0];
    return f.entities[i];
  }

  rotateEntityId(nextEntityId: number[]): any[] {
    let newEId: number;
    let newIdSet: number[];

    // If only one entry, take it and increment it by one.
    // If there are more than one, take it remove as there must have been an entity (or more) removed
    //  previously to have empty slots.
    newEId = nextEntityId[0];
    if (nextEntityId.length == 1) {
      newIdSet = [newEId+1];
    } else if (nextEntityId.length > 1) {
      newIdSet = nextEntityId.slice(1);
    }

    return [newEId, newIdSet];
  }

  @Action(AddFile)
  addFile(ctx: StateContext<FileStateModel>, action: AddFile) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      [action.file._key]: action.file
    });
  }
}
