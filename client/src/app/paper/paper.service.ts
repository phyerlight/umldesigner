import { Injectable } from '@angular/core';

import { Project, PaperScope } from 'paper';
// @ts-ignore
import paper from 'paper';

@Injectable()
export class PaperService {

  private initialized;

  public hasInitialized = new Promise((resolve, reject) => {
    this.initialized = resolve;
  });

  private _scope: PaperScope;
  get scope(): PaperScope {
    return this._scope;
  }

  // private _project: Project;
  get project(): Project {
    return this._scope.project;
  }

  private _fileId: string;
  get fileId(): string {
    return this._fileId;
  }

  constructor() {}

  initialize(el, fileId, scopeOptions={}) {
    let defaults = {
      applyMatrix: false,
      insertItems: false,
      ...scopeOptions
    };

    this._scope = new paper.PaperScope();
    // @ts-ignore
      this._scope.settings = {...this._scope.settings, ...defaults};
    this._scope.setup(el);

    this._fileId = fileId;
    this.initialized(true);
  }

}
