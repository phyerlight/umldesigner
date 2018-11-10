import {getActionTypeFromInstance, NgxsPlugin, Store} from "@ngxs/store";
import {filesByKey} from "../../common/state/file.state";
import {Navigate} from "@ngxs/router-plugin";
import {Project} from "../models/Project";
import {Injector} from "@angular/core";

export class NavigateByKey {
  static readonly type = '[AppRouter] NavigateByKey';
  constructor(public fileKey: string) {}
}

export class AppRouterPlugin implements NgxsPlugin {

  protected store: Store;
  constructor(protected injector: Injector) {}

  handle(state, action, next) {

    if (!this.store) this.store = this.injector.get(Store);

    if (getActionTypeFromInstance(action) === NavigateByKey.type) {
      let file = filesByKey(state.files, action.fileKey);
      let project: Project = state.projects[file.project_key];

      this.store.dispatch(new Navigate([project.name, file.name]));
    }

    return next(state, action);
  }
}