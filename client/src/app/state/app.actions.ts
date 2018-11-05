export class SetSelection {
  static readonly type = '[App] SetSelection';

  constructor(public fileKey: string, public entityIds: number[]) {
  }
}

export class OpenFile {
  static readonly type = '[App] OpenFile';
  constructor(public fileKey: string) {}
}

export class SetActiveFile {
  static readonly type = '[App] SetActiveFile';

  constructor(public fileKey: string) {
  }
}

export class EditClass {
  static readonly type = '[App] EditClass';

  constructor(public fileKey: string, public cls: any) {
  }
}

export class CancelEditClass {
  static readonly type = '[App] CancelEditClass';
}

export class SaveEditClass {
  static readonly type = '[App] SaveEditClass';

  constructor(public cls: any) {
  }
}