import {Action, Selector, State, StateContext, NgxsOnInit} from "@ngxs/store";
import {Project} from "../models/Project";
import {LoadProjects} from "./project.actions";
import {ProjectService} from "../services/project.service";
import {map, mergeMap, tap} from "rxjs/operators";
import {filesByKey, FileState} from "../../common/state/file.state";
import {File, FileMetadata} from "../../common/models";
import {GlobalFileStateModel} from "../../common/state/file.state"
import {ProjectWithMeta} from "../../common/models/ProjectWithMeta";
import {AddFile} from "../../common/state/file.actions";

export interface ProjectStateModel {
  [projectKey: string]: Project
}

@State<ProjectStateModel>({
  name: "projects",
  defaults: {}
})
export class ProjectState implements NgxsOnInit {

  constructor(protected projectService: ProjectService) {}

  ngxsOnInit(ctx: StateContext<ProjectStateModel>) {
    // ctx.dispatch(new LoadProjects());
  }

  @Selector()
  static projectByKey(projects: ProjectStateModel) {
    return (key: string): Project => {
      return projects[key];
    }
  }

  @Selector()
  static projectList(projects: ProjectStateModel): Project[] {
    return Object.keys(projects).map(k => projects[k]);
  }

  @Selector([FileState])
  static projectFiles(projects: ProjectStateModel, files: GlobalFileStateModel): (project: Project) => File[] {
    return (project: Project): File[] => {
      return filesByKey(files, project.fileKeys);
    }
  }

  @Selector([FileState])
  static projectFileByName(projects: ProjectStateModel, files: GlobalFileStateModel): (projectName:string, name:string) => File {
    return (projectName: string, name: string): File => {
      let project = Object.keys(projects).map(pk => projects[pk]).find(p => p.name == projectName);
      if (project) {
        return filesByKey(files, project.fileKeys).find(file => file.name == name);
      } else {
        return null;
      }
    }
  }

  // @Action(LoadProjects)
  // loadProjects(ctx: StateContext<ProjectStateModel>) {
    // let files: FileMetadata[] = [];
    // return this.projectService.getProjectList().pipe(
    //   tap((list: ProjectWithMeta[]) => {
    //     let result: ProjectStateModel = {};
    //     list.forEach((p: ProjectWithMeta) => {
    //       files.push(...p.files);
    //       p.fileKeys = p.files.map(f => f._key);
    //       delete p.files;
    //       result[p._key] = p;
    //     });
    //     ctx.setState(result);
    //   }),
    //   mergeMap(() => ctx.dispatch(files.map(f => new AddFile(f as File))))
    // );
  // }
}
