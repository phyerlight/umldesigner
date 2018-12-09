import {Point} from "../../common/models";

export class PatchClassMetaData {
    static readonly type = '[ClassFile] PatchClassMetaData';

    constructor(public fileKey: string, public clsId: number, public clsMeta) {
    }
}

export class MoveClass {
    static readonly type = '[ClassFile] MoveClass';

    constructor(public file_key: string, public id: number, public point: Point) {}
}