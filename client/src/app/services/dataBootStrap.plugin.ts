import {getActionTypeFromInstance, NgxsPlugin} from "@ngxs/store";
import {LoadProjects} from "../state/project.actions";
import {File, FileMetadata} from "../../common/models";
import {flatMap, mergeMap, tap} from "rxjs/operators";
import {ProjectWithMeta} from "../../common/models/ProjectWithMeta";
import {ProjectStateModel} from "../state/project.state";
import {AddFile} from "../../common/state/file.actions";
import {ProjectService} from "./project.service";
import {GlobalFileStateModel} from "../../common/state/file.state";

export class DataBootStrapPlugin implements NgxsPlugin {

  constructor(protected projectService: ProjectService) {}

  handle(state, action, next) {
    if (getActionTypeFromInstance(action) === LoadProjects.type) {
      let filelist: FileMetadata[] = [];

      return this.projectService.getProjectList().pipe(
        tap((list: ProjectWithMeta[]) => {

          let projects: ProjectStateModel = {};

          list.forEach((p: ProjectWithMeta) => {
            filelist.push(...p.files);
            p.fileKeys = p.files.map(f => f._key);
            delete p.files;
            projects[p._key] = p;
          });

          let files = {};
          filelist.forEach(f => {
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
