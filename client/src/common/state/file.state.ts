import {Action, Selector, State, StateContext} from '@ngxs/store';
import {take, tap} from "rxjs/operators";

import {AddFile, LoadFile, SaveFile, SetFileList} from './file.actions';

import {AllFileStates, filesByKey} from "../index";
import {GlobalFileStateModel, File, FileType, FileTypeOptions} from "../models";
import {FileService} from "../services/file.service";

if (AllFileStates.length < 1) {
  console.error("No file states have been added. This most likely means that a dependency has been added forcing the root file state to be loaded first");
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

  /**
   * Load a file from database.
   * @param ctx
   * @param action
   */
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

  @Action(SaveFile)
  saveFile(ctx: StateContext<GlobalFileStateModel>, action: SaveFile) {

  }

  /**
   * Sets the list of files that are available locally.
   * @param ctx
   * @param files
   */
  @Action(SetFileList)
  setFileList(ctx: StateContext<GlobalFileStateModel>, {files}: SetFileList) {
    ctx.setState(files.reduce((acc, f) => {
      if (!acc[f.type]) acc[f.type] = {};
      acc[f.type][f._key] = f;
      return acc;
    }, {}));
  }

  /**
   * Adds a file to the local cache of files.
   * @param ctx
   * @param action
   */
  @Action(AddFile)
  addFile(ctx: StateContext<GlobalFileStateModel>, action: AddFile) {
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
