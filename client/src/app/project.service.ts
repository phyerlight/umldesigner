import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import { filter, map } from 'rxjs/operators';
import {File} from './file.service';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";

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

export class NameError extends Error {
  name = 'NameError';
}
export class NotFoundError extends Error {
  name = "NotFoundError";
}

@Injectable()
export class ProjectService {

  private url = environment.host+environment.database+'/projects';

  private _projects: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>(null);
  public projects$: Observable<Project[]> = this._projects.asObservable().pipe(filter(v => v != null));

  constructor(private http: HttpClient) {
    //TODO: Remove this for production
    window['projectService'] = this;
  }

  public getProjectList(): Observable<Project[]> {
    return this.http.get(this.url+'/list', {
      withCredentials: true,
      responseType: 'json'
    }).pipe(
      map((res: Project[]) => {
        this._projects.next(res);
        return res;
      })
    );
  }

  public getProjectByKey(key: string): Observable<Project> {
    return this.http.get(this.url+'/'+key).pipe(
      map((p: Project) => p)
    );

    // return this.projects$.pipe(
    //   map((projects: Project[]) => {
    //     return projects.find(p => p._key == key);
    //   })
    // );
  };

  public getProjectByName(name: string): Observable<Project> {
    return this.projects$.pipe(
      map((projects: Project[]) => {
        return projects.find(p => p.name == name);
      })
    );
  };

  public save(project: Project): Observable<Project> {
    let method = 'post';
    let url = this.url;
    if (project._key) {
      method = 'put';
      url = url+'/'+project._key;
    }
    return this.http[method](url, JSON.stringify(project), {
      withCredentials: true,
      responseType: "json"
    });
    // .map((proj: Project) => {
    //   // let v = this._projects.getValue();
    //   // v.push(proj);
    //   // this._projects.next(v);
    //   return proj;
    // });
  }

  public delete(project: Project): Observable<any> {
    return this.http.delete(this.url+'/'+project._key, {
      withCredentials: true
    });
    //   .pipe(
    //   map((res) => {
    //     let v = this._projects.getValue().filter(p => p._key != project._key);
    //     this._projects.next(v);
    //     return res;
    //   })
    // );
  }

  static createProject(name: string): Project {
    let obj: Project = {name: name};
    // obj.name = name;
    return obj;
  }

  // public getProjectByName(name: string): Observable<Project> {
  //   return this.projects$.map((ps:Project[]) => ps.find( value => value.name == name)).take(1);
  // }
  //
  // public addProject(p: Project): Observable<Project> {
  //   const ps = this.model.get();
  //   if (ps.find(v=>v.name == p.name) != null) {
  //     return Observable.throw(new NameError(`Name '${p.name}' is already in use`));
  //   }
  //   p._key = (ps.length+1).toString();
  //   ps.push(p);
  //   this.model.set(ps);
  //   return Observable.of(p);
  // }
  //
  // public addProjectByName(name: string): Observable<Project> {
  //   let ps = this.model.get();
  //   return this.addProject({_key: (ps.length+1).toString(), name: name, files: []});
  // }
  //
  // public removeProject(p: Project): Observable<boolean> {
  //   const ps: Project[] = this.model.get();
  //   let i = ps.findIndex(v => v._key == p._key);
  //   if (i > -1) {
  //     ps.splice(i, 1);
  //     this.model.set(ps);
  //     return Observable.of(true);
  //   } else {
  //     return Observable.throw(new NotFoundError("Could not find project "+p.name+" to remove"));
  //   }
  // }
  //
  // /**
  //  * Gets a file from the store using a project name and file name
  //  * @param {string} projectName Name of the project
  //  * @param {string} fileName Name of the file in the project
  //  * @return {Observable<File>} The file or an error wrapped in an observable.
  //  */
  // public getFile(projectName: string, fileName: string): Observable<File> {
  //   return this.getProjectByName(projectName).map(p=> {
  //     if (p) {
  //       let file =p.files.find(f => f.name == fileName);
  //       if (file) {
  //         return file;
  //       } else {
  //         throw new NotFoundError("Could not find file with name "+fileName);
  //       }
  //     } else {
  //       throw new NotFoundError("Could not find project with name "+projectName);
  //     }
  //   });
  // }
  //
  // /**
  //  * Adds a file to a project
  //  * @param {Project} project
  //  * @param {File} file
  //  * @return {Observable<File>}
  //  */
  // public addFile(project: Project, file: File): Observable<File> {
  //   const ps = this.model.get();
  //   let p = ps.find(v=> v._key == project._key);
  //   if (p) {
  //     if (p.files.find(v => v.name == file.name) != null) {
  //       return Observable.throw(new NameError(`Name '${file.name}' is already in use`));
  //     }
  //     p.files.push(file);
  //     this.model.set(ps);
  //     return Observable.of(file);
  //   } else {
  //     return Observable.throw(new NotFoundError(`Could not find project ${project.name}`));
  //   }
  // }
  //
  // public addFileByName(project: Project, name: string): Observable<File> {
  //   return this.addFile(project, {_key: project._key+project.files.length, name: name, data: {}});
  // }
  //
  // public removeFile(project: Project, file: File): Observable<boolean> {
  //   const ps: Project[] = this.model.get();
  //   let p = ps.find(v => v._key == project._key);
  //   if (p) {
  //     let i = p.files.findIndex(v => v.name == file.name);
  //     if (i > -1) {
  //       p.files.splice(i, 1);
  //       this.model.set(ps);
  //       return Observable.of(true);
  //     } else {
  //       return Observable.throw(new NotFoundError(`Could not find file ${file.name}`));
  //     }
  //   } else {
  //     return Observable.throw(new NotFoundError(`Could not find project ${project.name}`));
  //   }
  // }
}
