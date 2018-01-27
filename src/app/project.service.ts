import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {ModelFactory, Model} from "ngx-model";

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

export interface File {
    name: string;
    type: FileType;
    data: object;
}

export interface Project {
    id: string;
    name: string;
    files: Array<File>;
}

export class NameError extends Error {}
export class NotFoundError extends Error {}


@Injectable()
export class ProjectService {

  // private _projects: BehaviorSubject<Project[]> = new BehaviorSubject([
  //   new Project("1", 'Test', [
  //       {name: 'test model', type: FileType.Class, data:{}},
  //       {name: 'test drawing', type: FileType.Mock, data:{}}
  //     ]),
  //   new Project("2", 'Food', [
  //       {name: 'Fruit model', type: FileType.Class, data:{}},
  //       {name: 'Grain Model', type: FileType.Class, data:{}},
  //       {name: 'front end', type: FileType.Mock, data:{}}
  //     ])
  // ]);

  private model: Model<Project[]>;

  public projects$: Observable<Project[]>;

  constructor(private modelFactory: ModelFactory<Project[]>) {
    this.model = this.modelFactory.create([
      {id: "1", name: 'Test', files: [
        {name: 'test model', type: FileType.Class, data:{}},
        {name: 'test drawing', type: FileType.Mock, data:{}}
      ]},
      {id: "2", name: 'Food', files: [
        {name: 'Fruit model', type: FileType.Class, data:{}},
        {name: 'Grain Model', type: FileType.Class, data:{}},
        {name: 'front end', type: FileType.Mock, data:{}}
      ]}
    ]);
    this.projects$ = this.model.data$;
    //TODO: Remove this for production
    window['projectService'] = this;
  }

  public getProjectByName(name: string): Observable<Project> {
    return this.projects$.map((ps:Project[]) => ps.find( value => value.name == name));
  }

  public addProject(p: Project): Observable<Project> {
    const ps = this.model.get();
    if (ps.find(v=>v.name == p.name) != null) {
      return Observable.throw(new NameError(`Name '${p.name}' is already used`));
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

  public getFile(projectName: string, fileName: string): Observable<File> {
    return this.getProjectByName(projectName).map(p=> {
      return p.files.find(f => f.name == fileName);
    });
  }

  public addFile(project: Project, file: File): Observable<File> {
    const ps = this.model.get();
    let p = ps.find(v=> v.id == project.id);
    if (p) {
      p.files.push(file);
      this.model.set(ps);
      return Observable.of(file);
    } else {
      throw new NotFoundError(`Could not find project ${project.name}`);
    }
  }

  public addFileByName(project: Project, name: string, type: FileType): Observable<File> {
    return this.addFile(project, {name: name, type: type, data: {}});
  }
}
