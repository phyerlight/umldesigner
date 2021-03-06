import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

import {Project} from "../models/Project";
import {ProjectWithMeta} from "../models/ProjectWithMeta";

import {environment} from "../../environments/environment";

export class NameError extends Error {
  name = 'NameError';
}
export class NotFoundError extends Error {
  name = "NotFoundError";
}

@Injectable()
export class ProjectService {

  private url = environment.host+environment.database+'/projects';

  constructor(private http: HttpClient) {
    //TODO: Remove this for production
    window['projectService'] = this;
  }

  public getProjectList(): Observable<ProjectWithMeta[]> {
    return this.http.get(this.url+'/list', {
      withCredentials: true,
      responseType: 'json'
    }) as Observable<ProjectWithMeta[]>;
  }

  public getProjectByKey(key: string): Observable<Project> {
    return this.http.get(this.url+'/'+key) as Observable<Project>;
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
  }

  public delete(project: Project): Observable<any> {
    return this.http.delete(this.url+'/'+project._key, {
      withCredentials: true
    });
  }
}
