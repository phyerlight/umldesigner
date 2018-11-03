import {File} from "../models";

export class LoadFile {
  static readonly type = '[File] LoadFile';
  constructor(public file_key: string) {}
}

export class AddFile {
  static readonly type = '[File] AddFile';
  constructor(public file: File) {}
}