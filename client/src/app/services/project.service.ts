import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import { filter, map } from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Project} from "../models/Project";
import {ProjectWithMeta} from "../../common/models/ProjectWithMeta";

export class NameError extends Error {
  name = 'NameError';
}
export class NotFoundError extends Error {
  name = "NotFoundError";
}

@Injectable()
export class ProjectService {

  private url = environment.host+environment.database+'/projects';

  // private _projects: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>(null);
  // public projects$: Observable<Project[]> = this._projects.asObservable().pipe(filter(v => v != null));

  constructor(private http: HttpClient) {
    //TODO: Remove this for production
    window['projectService'] = this;
  }

  public getProjectList(): Observable<ProjectWithMeta[]> {
    return this.http.get(this.url+'/list', {
      withCredentials: true,
      responseType: 'json'
    }) as Observable<ProjectWithMeta[]>;
      // .pipe(
      // map((res: Project[]) => {
      //   // this._projects.next(res);
      //   return res;
      // })
    // )
  }

  public getProjectByKey(key: string): Observable<Project> {
    return this.http.get(this.url+'/'+key) as Observable<Project>;
    //   .pipe(
    //   map((p: Project) => p)
    // );
  };

  // public getProjectByName(name: string): Observable<Project> {
  //   return this.projects$.pipe(
  //     map((projects: Project[]) => {
  //       return projects.find(p => p.name == name);
  //     })
  //   );
  // };

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
  }

  public delete(project: Project): Observable<any> {
    return this.http.delete(this.url+'/'+project._key, {
      withCredentials: true
    });
  }
}
