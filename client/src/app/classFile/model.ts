import {FileBase, FileEntity, FileType, Point, Relation} from "../state/model";

export enum RelationType {
  Assoc = "ASSOC",
  Inherit = "INHERIT"
}

export enum FileEntityType {
  Class = 'CLASS',
  Relation = 'RELATION'
}

export interface ClassEntity extends FileEntity {
  type: FileEntityType.Class,
  metadata: {
    location: Point,
    width: number,
    height: number
  },
  name: string,
  attrs: string
}

let classCount = 1;
export function createClassEntity(cls) {
  return {
    type: FileEntityType.Class,
    metadata: {
      location: null,
      width: null,
      height: null
    },
    // name: `New Class ${classCount++}`,
    name: '',
    attrs: '',
    ...cls
  }
}

export interface RelationEntity extends FileEntity {
  type: FileEntityType.Relation,
  reltype: Relation,
  fromId: number,
  toId: number
}

export type ClassFileEntities = ClassEntity | RelationEntity;

export interface ClassFile extends FileBase {
  type: FileType.Class,
  entities: {
    [id: number]: ClassFileEntities
  }
}
