import {Point} from "../../common/models";
import {ClassEntity} from "../models";

export class PatchClassMetaData {
    static readonly type = '[ClassFile] PatchClassMetaData';

    constructor(public fileKey: string, public clsId: number, public clsMeta) {
    }
}

export class PatchClass {
    static readonly type = '[ClassFile] PatchClass';

    constructor(public fileKey: string, public cls: Partial<ClassEntity>) {
    }
}

export class AddClass {
    static readonly type = '[ClassFile] AddClass';

    constructor(public fileKey: string, cls: Partial<ClassEntity>={}) {}
}

export class MoveClass {
    static readonly type = '[ClassFile] MoveClass';

    constructor(public file_key: string, public id: number, public point: Point) {}
}