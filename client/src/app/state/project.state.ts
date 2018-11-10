import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Project} from "../models/Project";
import {SetProjectList} from "./project.actions";
import {filesByKey, FileState} from "../../common/state/file.state";
import {File} from "../../common/models";
import {GlobalFileStateModel} from "../../common/state/file.state"

export interface ProjectStateModel {
  [projectKey: string]: Project
}

@State<ProjectStateModel>({
  name: "projects",
  defaults: {}
})
export class ProjectState {

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

  @Action(SetProjectList)
  setProjectList(ctx: StateContext<ProjectStateModel>, {projects}: SetProjectList) {
    ctx.setState(projects.reduce((acc, p) => {
      acc[p._key] = p;
      return acc;
    }, {}));
  }
}
