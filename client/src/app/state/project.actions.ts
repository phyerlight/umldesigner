import {Project} from "../models/Project";

export class LoadProjectList {
  static readonly type = '[Project] LoadProjectList';
  constructor() {}
}

export class SetProjectList {
  static readonly type = '[Project] SetProjectList';
  constructor(public projects: Project[]) {}
}

export class LoadProjectsSuccess {
  static readonly type = '[Project] Load Projects Success';
  constructor() {}
}

export class LoadProjectsFail {
  static readonly type = '[Project] Load Projects Fail';
  constructor() {}
}
