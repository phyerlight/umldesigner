import {File, FileEntity, FileMetadata} from "../models";

export class LoadFile {
  static readonly type = '[File] LoadFile';
  constructor(public file_key: string) {}
}

export class SetFileList {
  static readonly type = '[File] SetFileList';
  constructor (public files: FileMetadata[]) {}
}

export class AddFile {
  static readonly type = '[File] AddFile';
  constructor(public file: File) {}
}

export class PatchEntity<T extends FileEntity> {
  static readonly type = '[File] PatchEntity';

  constructor(public fileKey: string, public entity: Partial<T>, public ids: number[] = null) {
  }
}

export class AddEntity<T extends FileEntity> {
  static readonly type = '[File] AddEntity';

  constructor(public fileKey: string, public entity: T) {
  }
}