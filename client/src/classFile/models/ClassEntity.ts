import {FileEntity, Point} from "../../common/models";
import {ClassFileEntityType} from "./ClassFileEntityType";
import {FileEntityWithMeta} from "../../common/models/FileEntityWithMeta";

export interface ClassEntity extends FileEntityWithMeta {
    type: ClassFileEntityType.Class,
    name: string,
    attrs: string
}

export function createClassEntity(cls) {
    return {
        type: ClassFileEntityType.Class,
        metadata: {
            location: {x: 0, y: 0},
            width: 0,
            height: 0
        },
        name: '',
        attrs: '',
        ...cls
    }
}