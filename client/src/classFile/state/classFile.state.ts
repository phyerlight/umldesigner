import {Action, Selector, State, StateContext} from "@ngxs/store";
import {ClassEntity, createClassEntity, CLASS_FILE_TYPE, ClassFileEntityType, RelationEntity} from "../models";
import {FileStateModel, filterByEntityType} from "../../common/models";
import {AddClass, AddRelation, PatchClass, PatchClassMetaData} from "./classFile.actions";
import {FileStateDecorator, rotateEntityId} from "../../common";
import {FileStateLike} from "../../common/models/FileStateLike";

@FileStateDecorator
@State<FileStateModel>({
  name: CLASS_FILE_TYPE,
  defaults: {}
})
export class ClassFileState extends FileStateLike {

  @Selector()
  static fileByKey(files: FileStateModel) {
    return FileStateLike.fileByKey(files);
  }

  @Selector()
  static classesByFileKey(files: FileStateModel) {
    return (fileKey: string) => {
      if (files[fileKey].type == CLASS_FILE_TYPE) {
        return filterByEntityType(ClassFileEntityType.Class, files[fileKey]);
      } else {
        throw new Error((`File ${fileKey} is of type ${files[fileKey].type} and does not have any classes`));
      }
    }
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

  classEntityCount = 1;

  @Action(AddClass)
  addClass(ctx: StateContext<FileStateModel>, action: AddClass) {
    const files = ctx.getState();

    let [eId, nextEntityId] = rotateEntityId(files[action.fileKey].nextEntityId);

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

  @Action(AddRelation)
  addRelation(ctx: StateContext<FileStateModel>, action: AddRelation) {
    const files = ctx.getState();

    let [eId, nextEntityId] = rotateEntityId(files[action.fileKey].nextEntityId);

    ctx.setState({
      ...files,
      [action.fileKey]: {
        ...files[action.fileKey],
        nextEntityId,
        entities: {
          ...files[action.fileKey].entities,
          [eId]: {
            ...action.relation,
            id: eId,
          } as RelationEntity
        }
      }
    })

  }
}