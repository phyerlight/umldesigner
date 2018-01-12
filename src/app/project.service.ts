import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

export class FileType {

  public static Class = new FileType('class', 'Class', 'Class Diagram');
  public static Mock = new FileType('mock', 'Mock Up', 'Webpage Mockup');

  private static typeList: FileType[] = [FileType.Class, FileType.Mock];

  constructor(
    public id: string,
    public name: string,
    public desc: string
  ) {}

  public static getTypes(): FileType[] {
    return FileType.typeList;
  }

  public static getTypeById(typeId: string): FileType {
    return FileType.typeList.find(t=>t.id == typeId);
  }
}

export class File {
  constructor(
    public name: string,
    public type: FileType,
    public data: object
  ) {}
}

type ProjectFields = {
  id?: string,
  name?: string,
  files?: Array<File>
}

export class Project {
  constructor(
    public id: string|ProjectFields,
    public name: string,
    public files: Array<File>
  ) {
    if (typeof id !== 'string') {
      let projectObj = id;
      this.id = projectObj.id;
      this.name = projectObj.name;
      this.files = projectObj.files;
    }
  }
}

export class NameError extends Error {}


@Injectable()
export class ProjectService {

  private _projects: BehaviorSubject<Project[]> = new BehaviorSubject([
    {id: "1", name: 'Test', files:[
        {name: 'test model', type: FileType.Class, data:{}},
        {name: 'test drawing', type: FileType.Mock, data:{}}
      ]},
    {id: "2", name: 'Food', files:[
        {name: 'Fruit model', type: FileType.Class, data:{}},
        {name: 'Grain Model', type: FileType.Class, data:{}},
        {name: 'front end', type: FileType.Mock, data:{}}
      ]}
  ]);

  public readonly projects: Observable<Project[]> = this._projects.asObservable();

  constructor() {
    window.projectService = this;
  }

  public getProjects(): Observable<Project[]> {
    return this.projects;
  }

  public getProjectNames(): Observable<string[]> {
    return this.projects.map((ps: Project[])=>{return ps.map((val: Project)=>val.name)});
  }

  public getProjectByName(name: string): Project {
    return this._projects.getValue().find(value=>value.name == name);
  }
  public getProjectById(id: string): Project {
    return this._projects.getValue().find(value=>value.id == id);
  }

  public addProject(p: Project): Observable<Project> {
    let ps = this._projects.getValue();
    if (ps.find(v=>v.name == p.name) != null) {
      return Observable.throw(new NameError("Name '${p.name}' is already used"));
    }
    p.id = (ps.length+1).toString();
    ps.push(p);
    this._projects.next(ps);
    return Observable.of(p);
  }

  public addProjectByName(name: string): Observable<Project> {
    let ps = this._projects.getValue();
    return this.addProject(new Project((ps.length+1).toString(), name, []));
  }

  public getFileNames(pName: string): string[] {
    let p = this.getProjectByName(pName);
    if (p) {
      return p.files.map(val=>val.name);
    } else {
      return [];
    }

  }

  public getDrawing(projectName: string, fileName: string) {
    return this.getProjectByName(projectName).files.find(f=>f.name == fileName);
  }

  public addDrawing(projectName, name, type: FileType) {
    this.getProjectByName(projectName).files.push(new File(name, type, {}));
    this._projects.next(this._projects.getValue());
  }
}
