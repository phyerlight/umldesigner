import {Point} from "../../common/models";
import {ClassEntity} from "../models";

export class PatchClassMetaData {
    static readonly type = '[File] PatchClassMetaData';

    constructor(public fileKey: string, public clsId: number, public clsMeta) {
    }
}

export class PatchClass {
    static readonly type = '[File] PatchClass';

    constructor(public fileKey: string, public cls: Partial<ClassEntity>) {
    }
}

export class AddClass {
    static readonly type = '[File] AddClass';

    constructor(public fileKey: string, cls: Partial<ClassEntity>={}) {}
}

export class MoveClass {
    static readonly type = '[File] MoveClass';

    constructor(public id: number, public point: Point) {
    }
}