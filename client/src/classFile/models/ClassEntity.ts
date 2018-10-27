import {FileEntity, Point} from "../../common/models";
import {ClassFileEntityType} from "./ClassFileEntityType";

export interface ClassEntity extends FileEntity {
    type: ClassFileEntityType.Class,
    metadata: {
        location: Point,
        width: number,
        height: number
    },
    name: string,
    attrs: string
}

export function createClassEntity(cls) {
    return {
        type: ClassFileEntityType.Class,
        metadata: {
            location: null,
            width: null,
            height: null
        },
        name: '',
        attrs: '',
        ...cls
    }
}