import {File} from "../file.service";
import {State} from "@ngxs/store";

export interface Project {
  _key?: string;
  name: string;
  files?: Array<File>;
}

export class ProjectI implements Project {
  _key?: string;
  name: string;
  files?: Array<File>;

  public clone() {
    let obj: Project = {name: this.name};
    if (this._key) obj._key = this._key;
    // if (this.files) obj.files = this.files;
    return obj;
  }
}

export interface ProjectsStateModel {
  _key: string;
  name: string;
  files: [
    {
      _key: string,
      name: string
    }
  ];
}

@State<ProjectsStateModel[]>({
  name: "projects",
  defaults:[]
})
export class ProjectsState {

}
