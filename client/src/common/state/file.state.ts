import {Action, Selector, State, StateContext} from '@ngxs/store';
import {AddFile, LoadFile, SetFileList} from './file.actions';
import {File, FileStateModel, FileType, FileTypeOptions} from "../models";
import {FileService} from "../../app/services/file.service";
import {take, tap} from "rxjs/operators";
import {filesByKey} from "../index";
import {GlobalFileStateModel} from "../models/GlobalFileStateModel";
import {AllFileStates} from "../index";

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

  @Action(SetFileList)
  setFileList(ctx: StateContext<GlobalFileStateModel>, {files}: SetFileList) {
    ctx.setState(files.reduce((acc, f) => {
      if (!acc[f.type]) acc[f.type] = {};
      acc[f.type][f._key] = f;
      return acc;
    }, {}));
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
