import {Action, Selector, State, StateContext} from "@ngxs/store";
import {ClassFileEntities, ClassEntity, CLASS_FILE_TYPE, ClassFileEntityType, isAClassEntity} from "../models";
import {FileStateLike, FileStateModel, filterByEntityType} from "../../common/models";
import {PatchClassMetaData} from "./classFile.actions";
import {FileStateDecorator} from "../../common";
import {AddEntity} from "../../common/state/file.actions";

@FileStateDecorator
@State<FileStateModel>({
  name: CLASS_FILE_TYPE,
  defaults: {}
})
export class ClassFileState extends FileStateLike<ClassFileEntities> {

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

  // @Action(PatchClass)
  // patchClass(ctx: StateContext<FileStateModel>, action: PatchClass) {
  //   const state = ctx.getState();
  //   const {fileKey, cls, ids} = action;
  //
  //   const oldEntities = state[fileKey].entities;
  //   let newEntities =  oldEntities;
  //
  //   if (ids) {
  //     newEntities = {
  //       ...oldEntities,
  //       ...ids.reduce((acc, id) => {
  //         acc[id] = {
  //           ...oldEntities[id],
  //           ...cls
  //         };
  //         return acc;
  //       }, {})
  //     }
  //   } else {
  //     newEntities = {
  //       ...oldEntities,
  //       [cls.id]: {
  //         ...oldEntities[cls.id],
  //         ...cls
  //       }
  //     } as {[id: number]: ClassEntity}
  //   }
  //
  //   ctx.setState({
  //     ...state,
  //     [fileKey]: {
  //       ...state[fileKey],
  //       entities: newEntities
  //     }
  //   } as FileStateModel);
  // }

  classEntityCount = 1;

  @Action(AddEntity)
  addEntity(ctx: StateContext<FileStateModel>, action: AddEntity<ClassFileEntities>) {

    let {entity, fileKey}: {entity: ClassFileEntities, fileKey: string} = action;

    if (isAClassEntity(entity) && !entity.name) {
      entity = {
        ...entity,
        name: `New Class ${this.classEntityCount++}`
      } as ClassEntity
    }

    let newAction = new AddEntity<ClassFileEntities>(fileKey, entity);

    super.addEntity(ctx, newAction);
  }
}