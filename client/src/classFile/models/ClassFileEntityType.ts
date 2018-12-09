import {ClassFileEntities} from "./ClassFileEntities";
import {ClassEntity} from './ClassEntity';
import {RelationEntity} from './RelationEntity';

export enum ClassFileEntityType {
  Class = 'CLASS',
  Relation = 'RELATION'
}

export function isAClassEntity(e: ClassFileEntities): e is ClassEntity {
  return e.type == ClassFileEntityType.Class;
}

export function isARelationEntity(e: ClassFileEntities): e is RelationEntity {
  return e.type == ClassFileEntityType.Relation;
}