import {FileEntity} from "./FileEntity";
import {Point} from "./Point";

export interface FileEntityWithMeta extends FileEntity {
  metadata: {
    location: Point,
    width: number,
    height: number
  }
}

export function isEntityWithMeta(e: FileEntity|FileEntityWithMeta): e is FileEntityWithMeta {
  return (<FileEntityWithMeta>e).metadata != undefined;
}