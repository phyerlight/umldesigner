import {Action, Selector, State, StateContext} from '@ngxs/store';

import {AppState, AppStateModel} from '../../app/state/app.state';

import {AddFile, LoadFile} from './file.actions';
import {File, FileStateModel, FileType, FileTypeOptions} from "../models";
import {FileService} from "../../app/services/file.service";
import {tap} from "rxjs/operators";

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
    return state[appState.editor.activeKey]
  }

  @Selector()
  static fileByKey(state: FileStateModel) {
    return (key: string): File => {
      return state[key];
    }
  }

  @Selector()
  static fileType(state: FileStateModel) {
    return (key: string): FileTypeOptions => {
      return FileType[state[key].type];
    }
  }

  @Selector([AppState])
  static selectedEntity(files: FileStateModel, appState: AppStateModel) {
    if (appState.editor[appState.editor.activeKey].selection.length < 1 ||
      appState.editor.activeKey == null) {
      return null;
    }

    let f: File = files[appState.editor.activeKey];
    let i = appState.editor[appState.editor.activeKey].selection[0];
    return f.entities[i];
  }

  constructor(protected fileService: FileService) {}

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

  @Action(LoadFile)
  loadFile(ctx: StateContext<FileStateModel>, action: LoadFile) {
    return this.fileService.fetchFile(action.file_key).pipe(tap(file => {
      const state = ctx.getState();

      ctx.setState({
        ...state,
        [action.file_key]: file
      });
    }));
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
