export enum Relation {
  Assoc = "ASSOC",
  Inherit = "INHERIT"
}

export type Point = {
  x: number,
  y: number
}

export enum FileType {
  UI = 'UI',
  Class = 'CLASS'
}

export enum FileEntityType {
  Class = 'CLASS',
  Relation = 'RELATION'
}

export interface FileMetadata {
  _key: string,
  name: string,
  createdBy_key: string,
  createdOn: string,
  modifiedBy_key: string,
  modifiedOn: string,
  type: FileType
}

export interface FileBase {
  type: FileType,
  nextEntityId: Array<number>,
  entities: {[id:number]: any}
}

export interface FileEntity {
  id: number,
  type: string
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



export interface UIFile extends FileBase {
  type: FileType.UI
  entities: {
    [id: number]: FileEntity
  }
}

export type File = ClassFile | UIFile;

export interface User {
  _key: string,
  name: string,
  preferences: {}
}
