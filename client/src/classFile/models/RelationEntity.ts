import {FileEntity} from "../../common/models";
import {ClassFileEntityType} from "./ClassFileEntityType";
import {RelationType} from './RelationType';

export interface RelationEntity extends FileEntity {
    type: ClassFileEntityType.Relation,
    reltype: RelationType,
    fromId: number,
    toId: number
}

export function createRelationEntity(rel: Partial<RelationEntity>): RelationEntity {
  return {
    id: null,
    type: ClassFileEntityType.Relation,
    reltype: null,
    fromId: null,
    toId: null,
    ...rel
  }
}