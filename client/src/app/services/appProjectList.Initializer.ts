import {Store} from "@ngxs/store";
import {flatMap} from "rxjs/operators";

import {ProjectService} from "./project.service";

import {SetProjectList} from "../state/project.actions";
import {Project} from "../models/Project";
import {ProjectWithMeta} from "../models/ProjectWithMeta";

import {FileMetadata} from "../../common/models";
import {SetFileList} from "../../common/state/file.actions";

export function appProjectListInitializer(store: Store, projectService: ProjectService) {
  return function() {
    //This needs to return as a promise to so that the APP_INITIALIZER will
    // block. If not, then any file loaded on page start-up will not get
    // picked up.
    return projectService.getProjectList().pipe(flatMap((list: ProjectWithMeta[]) => {
      let fileList: FileMetadata[] = [];
      let projectList: Project[] = [];

      list.forEach((p: ProjectWithMeta) => {
        fileList.push(...p.files);
        p.fileKeys = p.files.map(f => f._key);
        delete p.files;
        projectList.push(p);
      });

      return store.dispatch([new SetProjectList(projectList), new SetFileList(fileList)]);
    })).toPromise();
  };
}