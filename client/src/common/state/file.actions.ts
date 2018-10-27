import {File} from "../models";


export class AddFile {
  static readonly type = '[File] AddFile';
  constructor(public file: File) {}
}