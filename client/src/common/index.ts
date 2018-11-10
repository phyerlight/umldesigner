import {File} from "./models";
import {GlobalFileStateModel} from "./models/GlobalFileStateModel";

export function exists(...v) {
  return v.every(v => v != null && v != undefined);
}

export function rotateEntityId(nextEntityId: number[]): any[] {
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