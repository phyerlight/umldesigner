import {FileStateModel} from "./FileStateModel";

export interface GlobalFileStateModel {
  [fileType: string]: FileStateModel
}