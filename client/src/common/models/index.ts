import {FileEntity} from "./FileEntity";
import { File } from './File';

export * from "./File";
export * from "./FileEntity";
export * from "./FileEntityType";
export * from "./FileEntityWithMeta";
export * from "./FileMetadata";
export * from "./FileStateLike";
export * from "./FileStateModel";
export * from "./FileType";
export * from "./FileTypeOptions";
export * from "./GlobalFileStateModel";
export * from "./Identity";
export * from "./PartialWithId";
export * from "./Point";

export function filterByEntityType(t: string, file: File): FileEntity[] {
  return Object.keys(file.entities).filter(eid => {
    let entity: FileEntity = file.entities[eid];
    return entity.type == t;
  }).map(eid => {
    return file.entities[eid];
  });
}

export {FileTypeOptions} from "./FileTypeOptions";