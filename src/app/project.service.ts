import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw'
import {ModelFactory, Model} from "ngx-model";

export interface File {
    name: string;
    data: object;
}

export interface Project {
    id: string;
    name: string;
    files: Array<File>;
}

export class NameError extends Error {
  name = 'NameError';
}
export class NotFoundError extends Error {
  name = "NotFoundError";
}


@Injectable()
export class ProjectService {

  private model: Model<Project[]>;
  public projects$: Observable<Project[]>;

  constructor(private modelFactory: ModelFactory<Project[]>) {
    this.model = this.modelFactory.create([
      {id: "1", name: 'Test', files: [
        {name: 'test model', data:{}},
        {name: 'test drawing', data:{}}
      ]},
      {id: "2", name: 'Food', files: [
        {name: 'Fruit model', data:{}},
        {name: 'Grain Model', data:{}},
        {name: 'front end', data:{}}
      ]},
      {id: "3", name: 'Test2', files: [
          {name: 'test model', data:{}},
          {name: 'test drawing', data:{}}
        ]},
      {id: "4", name: 'Food2', files: [
          {name: 'Fruit model', data:{}},
          {name: 'Grain Model', data:{}},
          {name: 'front end', data:{}}
        ]},
      {id: "5", name: 'Test3', files: [
          {name: 'test model', data:{}},
          {name: 'test drawing', data:{}}
        ]},
      {id: "6", name: 'Food3', files: [
          {name: 'Fruit model', data:{}},
          {name: 'Grain Model', data:{}},
          {name: 'front end', data:{}}
        ]},
      {id: "7", name: 'Test4', files: [
          {name: 'test model', data:{}},
          {name: 'test drawing', data:{}}
        ]},
      {id: "8", name: 'Food4', files: [
          {name: 'Fruit model', data:{}},
          {name: 'Grain Model', data:{}},
          {name: 'front end', data:{}}
        ]}
    ]);
    this.projects$ = this.model.data$;
    //TODO: Remove this for production
    window['projectService'] = this;
  }

  public getProjectByName(name: string): Observable<Project> {
    return this.projects$.map((ps:Project[]) => ps.find( value => value.name == name)).take(1);
  }

  public addProject(p: Project): Observable<Project> {
    const ps = this.model.get();
    if (ps.find(v=>v.name == p.name) != null) {
      return Observable.throw(new NameError(`Name '${p.name}' is already in use`));
    }
    p.id = (ps.length+1).toString();
    ps.push(p);
    this.model.set(ps);
    return Observable.of(p);
  }

  public addProjectByName(name: string): Observable<Project> {
    let ps = this.model.get();
    return this.addProject({id: (ps.length+1).toString(), name: name, files: []});
  }

  public removeProject(p: Project): Observable<boolean> {
    const ps: Project[] = this.model.get();
    let i = ps.findIndex(v => v.id == p.id);
    if (i > -1) {
      ps.splice(i, 1);
      this.model.set(ps);
      return Observable.of(true);
    } else {
      return Observable.throw(new NotFoundError("Could not find project "+p.name+" to remove"));
    }
  }

  /**
   * Gets a file from the store using a project name and file name
   * @param {string} projectName Name of the project
   * @param {string} fileName Name of the file in the project
   * @return {Observable<File>} The file or an error wrapped in an observable.
   */
  public getFile(projectName: string, fileName: string): Observable<File> {
    return this.getProjectByName(projectName).map(p=> {
      if (p) {
        let file =p.files.find(f => f.name == fileName);
        if (file) {
          return file;
        } else {
          throw new NotFoundError("Could not find file with name "+fileName);
        }
      } else {
        throw new NotFoundError("Could not find project with name "+projectName);
      }
    });
  }

  /**
   * Adds a file to a project
   * @param {Project} project
   * @param {File} file
   * @return {Observable<File>}
   */
  public addFile(project: Project, file: File): Observable<File> {
    const ps = this.model.get();
    let p = ps.find(v=> v.id == project.id);
    if (p) {
      if (p.files.find(v => v.name == file.name) != null) {
        return Observable.throw(new NameError(`Name '${file.name}' is already in use`));
      }
      p.files.push(file);
      this.model.set(ps);
      return Observable.of(file);
    } else {
      return Observable.throw(new NotFoundError(`Could not find project ${project.name}`));
    }
  }

  public addFileByName(project: Project, name: string): Observable<File> {
    return this.addFile(project, {name: name, data: {}});
  }

  public removeFile(project: Project, file: File): Observable<boolean> {
    const ps: Project[] = this.model.get();
    let p = ps.find(v => v.id == project.id);
    if (p) {
      let i = p.files.findIndex(v => v.name == file.name);
      if (i > -1) {
        p.files.splice(i, 1);
        this.model.set(ps);
        return Observable.of(true);
      } else {
        return Observable.throw(new NotFoundError(`Could not find file ${file.name}`));
      }
    } else {
      return Observable.throw(new NotFoundError(`Could not find project ${project.name}`));
    }
  }
}
