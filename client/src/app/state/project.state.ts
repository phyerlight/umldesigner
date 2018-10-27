import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Project} from "../models/Project";
import {LoadProjects} from "./project.actions";
import {ProjectService} from "../services/project.service";
import {map, mergeMap, tap} from "rxjs/operators";
import {FileState} from "../../common/state/file.state";
import {FileStateModel, File, FileMetadata} from "../../common/models";
import {ProjectWithMeta} from "../../common/models/ProjectWithMeta";
import {AddFile} from "../../common/state/file.actions";

export interface ProjectStateModel {
  [projectKey: string]: Project
}

@State<ProjectStateModel>({
  name: "projects",
  defaults: {}
})
export class ProjectState {

  constructor(protected projectService: ProjectService) {}

  @Selector()
  static projectList(projects: ProjectStateModel): Project[] {
    return Object.keys(projects).map(k => projects[k]);
  }

  @Selector([FileState])
  static projectFiles(projects: ProjectStateModel, files: FileStateModel): (project: Project) => File[] {
    return (project: Project): File[] => {
      return project.fileKeys.map(k => files[k]);
    }
  }

  @Selector([FileState])
  static projectFileByName(projects: ProjectStateModel, files: FileStateModel): (projectName:string, name:string) => File {
    return (projectName: string, name: string): File => {
      return Object.keys(projects).map(pk => projects[pk]).find(p => p.name == projectName)
        .fileKeys.map(k => files[k]).find(file => file.name == name);
    }
  }

  @Action(LoadProjects)
  loadProjects(ctx: StateContext<ProjectStateModel>) {
    let files: FileMetadata[] = [];
    return this.projectService.getProjectList().pipe(
      tap((list: ProjectWithMeta[]) => {
        let result: ProjectStateModel = {};
        list.forEach((p: ProjectWithMeta) => {
          files.push(...p.files);
          p.fileKeys = p.files.map(f => f._key);
          delete p.files;
          result[p._key] = p;
        });
        ctx.setState(result);
      }),
      mergeMap(() => ctx.dispatch(files.map(f => new AddFile(f as File))))
    );
  }
}
