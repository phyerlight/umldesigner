import {getActionTypeFromInstance, NgxsPlugin, Store} from "@ngxs/store";
import {LoadProjects} from "../state/project.actions";
import {FileMetadata} from "../../common/models";
import {flatMap, tap} from "rxjs/operators";
import {ProjectWithMeta} from "../../common/models/ProjectWithMeta";
import {ProjectStateModel} from "../state/project.state";
import {ProjectService} from "./project.service";

export function initializeAppProjects(store: Store) {
  return function() {
    //This needs to return as a promise to maintain so that the
    // APP_INITIALIZER will block. If not, then any file loaded
    // on page start-up will not get picked up.
    return store.dispatch(new LoadProjects()).toPromise();
  };
}

/**
 * Fetches the initial data containing both project and file metadata from the server
 * and places it in the store.
 */
export class DataBootStrapPlugin implements NgxsPlugin {

  constructor(protected projectService: ProjectService) {}

  handle(state, action, next) {
    if (getActionTypeFromInstance(action) === LoadProjects.type) {

      return this.projectService.getProjectList().pipe(
        tap((list: ProjectWithMeta[]) => {
          let fileList: FileMetadata[] = [];
          let projects: ProjectStateModel = {};

          list.forEach((p: ProjectWithMeta) => {
            fileList.push(...p.files);
            p.fileKeys = p.files.map(f => f._key);
            delete p.files;
            projects[p._key] = p;
          });

          let files = {};
          fileList.forEach(f => {
            if (!files[f.type]) {
              files[f.type] = {};
            }
            files[f.type][f._key] = f;
          });

          state = {
            ...state,
            projects,
            files
          };
        }),
        flatMap(v => next(state,action))
      );

    } else {
      return next(state, action);
    }
  }
}
