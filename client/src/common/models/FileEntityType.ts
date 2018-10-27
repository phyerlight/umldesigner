export type FileEntityType = {
    [name: string]: string
}
export let FileEntityType = {};

export function registerFileEntityType(name) {
    FileEntityType[name] = name;
}