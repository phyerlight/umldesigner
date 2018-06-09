import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {HttpClient} from "@angular/common/http";
import {Project} from "./project.service";
import { environment } from "../environments/environment";
import {File} from "./file.service";

export interface ProjectFile {
  _key?: string;
  _from: string;
  _to: string;
}

@Injectable()
export class ProjectFileService {

  private url = environment.host+environment.database+'/projectfiles';
  private projectPrefix = "umldesigner_projects/";
  private filePrefix = "umldesigner_files/";

  private _projectFiles: BehaviorSubject<ProjectFile[]> = new BehaviorSubject<ProjectFile[]>(null);
  public projectFile$: Observable<ProjectFile[]> = this._projectFiles.asObservable().filter(v => v != null);

  constructor(private http: HttpClient) { }

  public createProjectFile(project: Project, file: File): ProjectFile {
    return {
      _from: this.projectPrefix+project._key,
      _to: this.filePrefix+file._key
    }
  }

  public getFileByKey(fileKey: string): Observable<ProjectFile> {
    return this.projectFile$.map((pfs: ProjectFile[]) => {
      return pfs.find(f => f._to == this.filePrefix+fileKey);
    });
  };

  public getProjectsByKey(projectKey: string): Observable<ProjectFile[]> {
    return this.projectFile$.map((pfs: ProjectFile[]) => {
      return pfs.filter(f => f._from == this.projectPrefix+projectKey);
    });
  };

  public fetch(): Observable<ProjectFile[]> {
    return this.http.get(this.url, {
      withCredentials: true,
      responseType: 'json'
    }).map((pf: ProjectFile[]) => {
      this._projectFiles.next(pf);
      return pf;
    });
  }

  public save(projectFile: ProjectFile): Observable<ProjectFile> {
    let method = 'post';
    let url = this.url;
    if (projectFile._key) {
      method = 'put';
      url = url+'/'+projectFile._key;
    }
    return this.http[method](url, JSON.stringify(projectFile), {
      withCredentials: true,
      responseType: "json"
    }).map((pf: ProjectFile) => {
      let v = this._projectFiles.getValue();
      v.push(pf);
      this._projectFiles.next(v);
      return pf;
    });
  }

  public delete(projectFile: ProjectFile): Observable<any> {
    return this.http.delete(this.url+'/'+projectFile._key, {
      withCredentials: true
    }).map((res) => {
      let v = this._projectFiles.getValue().filter(pf => pf._key != projectFile._key);
      this._projectFiles.next(v);
      return res;
    });
  }
}
