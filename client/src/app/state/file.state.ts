import { State, Action, Selector, StateContext, Store } from '@ngxs/store';

import { File, ClassFile, ClassEntity, FileType, ClassFileEntities, FileEntityType, FileEntity, createClassEntity } from './model';

import { AppState, AppStateModel } from './app.state';

import { AddFile, PatchClassMetaData, PatchClass, AddClass } from './actions';

export interface FileStateModel {
  [x: string]: File
}

export function filterByEntityType(t: FileEntityType, file: File): FileEntity[] {
  return Object.keys(file.entities).filter(eid => {
    let entity: FileEntity = file.entities[eid];
    return entity.type == t;
  }).map(eid => {
    return file.entities[eid];
  });
}

@State<FileStateModel>({
  name: "files",
  defaults: {}
})
export class FileState {

  constructor(private store: Store) {}

  @Selector([AppState])
  static activeFile(state: FileStateModel, appState: AppStateModel) {
    return state[appState.selection.fileKey]
  }

  @Selector()
  static fileByKey(state: FileStateModel) {
    return (key: string) => {
      return state[key];
    }
  }

  @Selector()
  static classesByFileKey(files: FileStateModel) {
    return (fileKey: string) => {
      if (files[fileKey].type == FileType.Class) {
        return filterByEntityType(FileEntityType.Class, files[fileKey]);
      } else {
        throw new Error((`File ${fileKey} is of type ${files[fileKey].type} and does not have any classes`));
      }
    }
  }

  @Selector([AppState])
  static selectedEntity(files: FileStateModel, appState: AppStateModel) {
    if (appState.selection.entityIds.length < 1 ||
      appState.selection.fileKey == null) {
      return null;
    }

    let f: File = files[appState.selection.fileKey];
    let i = appState.selection.entityIds[0];
    return f.entities[i];
  }

  @Action(PatchClassMetaData)
  patchClassMetadata(ctx: StateContext<FileStateModel>, action: PatchClassMetaData) {
    const state = ctx.getState();
    // let activeFile = this.store.selectSnapshot(state => state.app.editor.activeFile);
    const {fileKey, clsId} = action;

    const cls = state[fileKey].entities[clsId] as ClassEntity;

    const newMetadata = {
      ...cls.metadata,
      ...action.clsMeta
    };

    ctx.setState({
      ...state,
      [fileKey]: {
        ...state[fileKey],
        entities: {
          ...state[fileKey].entities,
          [clsId]: {
            ...cls,
            metadata: newMetadata
          }
        }
      }
    } as FileStateModel);
  }

  @Action(PatchClass)
  patchClass(ctx: StateContext<FileStateModel>, action: PatchClass) {
    const state = ctx.getState();
    // let activeFile = this.store.selectSnapshot(state => state.app.editor.activeFile);
    const {fileKey, cls} = action;

    const oldcls = state[fileKey].entities[cls.id];

    ctx.setState({
      ...state,
      [fileKey]: {
        ...state[fileKey],
        entities: {
          ...state[fileKey].entities,
          [cls.id]: {
            ...oldcls,
            ...cls
          }
        }
      }
    } as FileStateModel);
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

  classEntityCount = 1;
  @Action(AddClass)
  addClass(ctx: StateContext<FileStateModel>, action: AddClass) {
    const files = ctx.getState();

    let [eId, nextEntityId] = this.rotateEntityId(files[action.fileKey].nextEntityId);

    ctx.setState({
      ...files,
      [action.fileKey]: {
        ...files[action.fileKey],
        nextEntityId,
        entities: {
          ...files[action.fileKey].entities,
          [eId]: createClassEntity({
            id: eId,
            name: `New Class ${this.classEntityCount++}`,
          })
        }
      }
    } as FileStateModel);
  }



  @Action(AddFile)
  addProject(ctx: StateContext<FileStateModel>, action: AddFile) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      [action.file._key]: action.file
    });
  }
}
