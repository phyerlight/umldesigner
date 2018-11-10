import {FileStateModel} from "./FileStateModel.state";

export interface GlobalFileStateModel {
  [fileType: string]: FileStateModel
}