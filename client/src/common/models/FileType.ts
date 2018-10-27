
export let FileType = {};

export function registerFileType(name, options = {}) {
    FileType[name] = options;
}

/**
 * A registered file type in the system
 */
// export class FileType {
//     private static registered: FileType[] = [];
//
//     /**
//      * Creates a new file type in the system with the given name.
//      * If there is a name collision, a warning will be issued.
//      * @param name The type name
//      */
//     constructor(public readonly name: string) {
//         let existType = FileType.list.find((v) => {
//             return v.name == name
//         });
//         if (existType) {
//             console.warn(`File type name ${name} already exists.`)
//         }
//
//         FileType.registered = [
//             ...FileType.registered,
//             this
//         ];
//         Object.freeze(FileType.registered);
//     }
//
//     /**
//      * List of registered types
//      */
//     static get list(): FileType[] {
//         return this.registered;
//     }
//
//     /**
//      * Returns the name of the type
//      */
//     public toString() {
//         return this.name;
//     }
//
//     /**
//      * Gets the file type using the string name or undefined if
//      * one could not be found. In the case of a name collision,
//      * the first one found is the one returned.
//      * @param name The file type name to search for
//      */
//     static fromString(name: string): FileType {
//         return FileType.list.find((v) => {
//             return v.name == name
//         });
//     }
// }