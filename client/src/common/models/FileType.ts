import {FileTypeOptions} from "./FileTypeOptions";

export let FileType: {[typeName: string]: FileTypeOptions} = {};

export function registerFileType(name, options) {
    FileType[name] = options;
}