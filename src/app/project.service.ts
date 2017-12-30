import { Injectable } from '@angular/core';

export class Project {
  constructor(
    public id: string,
    public name: string,
    public files: Array<{name: string, type: string, data: object}>
  ) {}
}

@Injectable()
export class ProjectService {

  private projects: Array<Project> = [
    {id: "1", name: 'Test', files:[
        {name: 'test model', type: 'class', data:{}},
        {name: 'test drawing', type: 'class', data:{}}
      ]},
    {id: "2", name: 'Food', files:[
        {name: 'Fruit model', type: 'class', data:{}},
        {name: 'Grain Model', type: 'class', data:{}},
        {name: 'front end', type: 'class', data:{}}
      ]}
  ];

  constructor() { }

  public getProjects(): Project[] {
    return this.projects;
  }

  public getProjectNames(): Array<string> {
    return this.projects.map((val: Project)=>val.name);
  }

  public getProjectByName(name: string): Project {
    return this.projects.find(value=>value.name == name);
  }
  public getProjectById(id: string): Project {
    return this.projects.find(value=>value.id == id);
  }

  public addProject(name: string) {
    this.projects.push({id: (this.projects.length+1).toString(), name: name, files: []});
  }

  public getFileNames(pid: string): string[] {
    return this.getProjectById(pid).files.map(val=>val.name);
  }

  public getDrawings(projectId: string) {

  }

  public addDrawing(projectName, name, type) {
    let p = this.getProjectByName(projectName);
    p.files.push({name: name, type: type, data: {}});
  }
}
