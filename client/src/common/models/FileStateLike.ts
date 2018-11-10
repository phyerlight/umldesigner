import {File} from "./File";
import {FileStateModel} from "./FileStateModel.state";

export class FileStateLike {
  static fileByKey(files: FileStateModel) {
    return (key: string): File => {
      return files[key];
    }
  }
}