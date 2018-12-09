import {File} from "./File";
import {FileStateModel} from "./FileStateModel.state";
import {Action, StateContext} from "@ngxs/store";
import {rotateEntityId} from "../index";
import {AddEntity, PatchEntity} from "../state/file.actions";
import {FileEntity} from "./FileEntity";
import {hasIdentity} from "./Identity";

export class FileStateLike<T extends FileEntity> {
  static fileByKey(files: FileStateModel) {
    return (key: string): File => {
      return files[key];
    }
  }

  @Action(PatchEntity)
  patchEntity(ctx: StateContext<FileStateModel>, action: PatchEntity<T>) {
    const state = ctx.getState();
    const {fileKey, entity, ids}: {fileKey: string, entity: Partial<T>, ids: number[]} = action;

    const oldEntities = state[fileKey].entities;
    let newEntities =  oldEntities;

    if (ids) {
      newEntities = {
        ...oldEntities,
        ...ids.reduce((acc, id) => {
          //Can't use spread operator here due to typescript problem with generics TS2698
          acc[id] = Object.assign({}, oldEntities[id], entity);
          return acc;
        }, {})
      }
    } else if (hasIdentity(entity)) {
      newEntities = {
        ...oldEntities,
        //Can't use spread operator here due to typescript problem with generics TS2698
        [entity.id]: Object.assign({}, oldEntities[entity.id], entity)
      } as {[id: number]: FileEntity}
    } else {
      console.log("No id provided when patching an entity");
    }

    ctx.setState({
      ...state,
      [fileKey]: {
        ...state[fileKey],
        entities: newEntities
      }
    } as FileStateModel);
  }

  addEntity(ctx: StateContext<FileStateModel>, action: AddEntity<T>) {
    const files = ctx.getState();
    let {fileKey, entity}: {fileKey: string, entity: T} = action;

    let eId, nextEntityId, newEntity;
    if (entity.id) {
      eId = entity.id;
      nextEntityId = files[fileKey].nextEntityId
    } else {
      [eId, nextEntityId] = rotateEntityId(files[fileKey].nextEntityId);
      //Can't use spread operator here due to typescript problem with generics TS2698
      newEntity = Object.assign({}, entity, {id: eId});
    }

    ctx.setState({
      ...files,
      [fileKey]: {
        ...files[fileKey],
        nextEntityId,
        entities: {
          ...files[fileKey].entities,
          [eId]: newEntity
        }
      }
    });
  }
}