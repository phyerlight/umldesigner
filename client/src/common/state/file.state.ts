import {Action, Selector, State, StateContext} from '@ngxs/store';
import {AddFile, LoadFile} from './file.actions';
import {File, FileStateModel, FileType, FileTypeOptions} from "../models";
import {FileService} from "../../app/services/file.service";
import {take, tap} from "rxjs/operators";

export let AllFileStates = [];
Object.keys(FileType).forEach(t => {
    AllFileStates.push(FileType[t].state);
});

export interface GlobalFileStateModel {
    [fileType: string]: FileStateModel
}

export function filesByKey(files: GlobalFileStateModel, keys: string): File;
export function filesByKey(files: GlobalFileStateModel, keys: string[]): File[];
export function filesByKey(files: GlobalFileStateModel, keys: string|string[]): File|File[] {
  let mergedDict = Object.keys(files).reduce((dict, type) => { return {...dict, ...files[type]}; }, {});

  if (typeof keys == 'string') {
    return mergedDict[keys];
  } else {
    return keys.map(k => mergedDict[k]);
  }
}

@State<GlobalFileStateModel>({
  name: "files",
  defaults: {},
  children: AllFileStates
})
export class FileState {

  @Selector()
  static fileByKey(state: GlobalFileStateModel) {
    return (key: string): File => {
      return filesByKey(state, key);
    }
  }

  @Selector()
  static fileType(state: GlobalFileStateModel) {
    return (key: string): FileTypeOptions => {
      return FileType[filesByKey(state, key).type];
    }
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
  loadFile(ctx: StateContext<GlobalFileStateModel>, action: LoadFile) {
    return this.fileService.fetchFile(action.file_key).pipe(take(1),tap(file => {
      const state = ctx.getState();

      ctx.setState({
        ...state,
        [file.type]: {
          ...state[file.type],
          [action.file_key]: file
        }
      });
    }));
  }

  @Action(AddFile)
  addFile(ctx: StateContext<FileStateModel>, action: AddFile) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      [action.file.type]: {
        ...state[action.file.type],
        [action.file._key]: action.file
      }
    });
  }
}
