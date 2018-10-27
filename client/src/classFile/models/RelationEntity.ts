import {FileEntity} from "../../common/models";
import {ClassFileEntityType, RelationType} from "./index";

export interface RelationEntity extends FileEntity {
    type: ClassFileEntityType.Relation,
    reltype: RelationType,
    fromId: number,
    toId: number
}