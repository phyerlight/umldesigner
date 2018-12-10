import {File, GlobalFileStateModel} from "./models";

export * from './common.module';

/**
 * Determines whether all the objects passed in are not null and not undefined.
 * @param v
 */
export function exists(...v) {
  return v.every(v => v != null && v != undefined);
}

/**
 * Rotates an entity's id to obtain the next id to be used and give back the nextEntityId value to store in the file.
 * @param nextEntityId Number array of next possible Ids that can be used.
 * @return [newEId, newIdSet] newEId is the next Id to set, newIdSet is the new value to set to nextEntityId.
 */
export function rotateEntityId(nextEntityId: number[]): any[] {
  let newEId: number;
  let newIdSet: number[];

  // If only one entry, take it and increment it by one.
  // If there are more than one, take it remove as there must have been an entity (or more) removed
  //  previously to have empty slots.
  newEId = nextEntityId[0] || 1;
  if (nextEntityId.length == 1) {
    newIdSet = [newEId+1];
  } else if (nextEntityId.length > 1) {
    newIdSet = nextEntityId.slice(1);
  }

  return [newEId, newIdSet];
}

/**
 * Search the files slice for a particular file key.
 * @param files Files grouped by file type.
 * @param keys Key or array of file keys to search for.
 */
export function filesByKey(files: GlobalFileStateModel, keys: string): File;
export function filesByKey(files: GlobalFileStateModel, keys: string[]): File[];
export function filesByKey(files: GlobalFileStateModel, keys: string|string[]): File|File[] {
  // collect all the files into a single dictionary keyed on file key
  let mergedDict = Object.keys(files).reduce((dict, type) => { return {...dict, ...files[type]}; }, {});

  if (typeof keys == 'string') {
    return mergedDict[keys];
  } else {
    return keys.map(k => mergedDict[k]);
  }
}

/**
 * The list of all file type state slices
 */
export let AllFileStates = [];

/**
 * Decorator to let the system know that the class it's decorating is one of the file type states.
 * @param constructor
 * @constructor
 */
export function FileStateDecorator(constructor: Function) {
  AllFileStates.push(constructor);
}