import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {HttpClient} from "@angular/common/http";
import { filter, map } from 'rxjs/operators';
import {Project} from "./project.service";
import { environment } from "../environments/environment";

export interface Class {
  id: number
  position: {x: number, y: number},
  name: string,
  attrs: [string]
}

export interface Relation {
  type: string,
  fromId: number,
  toId: number
}

interface FileData {
  classes?: Class[],
  relations?: Relation[]
}

export interface File {
  _key?: string;
  project_key?: string;
  name: string;
  data: FileData;
}

@Injectable()
export class FileService {

  private url = environment.host+environment.database+'/files';

  // private _files: BehaviorSubject<File[]> = new BehaviorSubject<File[]>(null);
  // public file$: Observable<File[]> = this._files.asObservable().pipe(filter(v => v != null));

  constructor(private http: HttpClient) { }

  public getFileByKey(key: string): Observable<File> {
    return this.http.get(this.url+'/'+key).pipe(map((files: File[]) => {
      return files.find(f => f._key == key);
    }));
  };

  // public getFilesByKey(keys: string[]): Observable<File[]> {
  //   return this.file$.pipe(map((files: File[]) => {
  //     return files.filter(f => keys.includes(f._key));
  //   }));
  // };

  // public getFileByName(name: string): Observable<File> {
  //   return this.file$.pipe(map((files: File[]) => {
  //     return files.find(f => f.name == name);
  //   }));
  // };

  static createFile(name: string, project: Project): File {
    return {
      project_key: project._key,
      name: name,
      data: {
        classes:[],
        relations:[]
      }
    }
  }

  // public getProjectList(): Observable<File[]> {
  //   return this.http.get(this.url, {
  //     withCredentials: true,
  //     responseType: 'json'
  //   }).pipe(map((f: File[]) => {
  //     this._files.next(f);
  //     return f;
  //   }));
  // }

  public save(file: File): Observable<File> {
    let method = 'post';
    let url = this.url;
    if (file._key) {
      method = 'put';
      url = url+'/'+file._key;
    }
    return this.http[method](url, JSON.stringify(file), {
      withCredentials: true,
      responseType: "json"
    });
    //   .pipe(map((f: File) => {
    //   let v = this._files.getValue();
    //   v.push(f);
    //   this._files.next(v);
    //   return f;
    // }));
  }

  public delete(file: File): Observable<any> {
    return this.http.delete(this.url+'/'+file._key, {
      withCredentials: true
    });
    //   .pipe(map((res) => {
    //   let v = this._files.getValue().filter(p => p._key != file._key);
    //   this._files.next(v);
    //   return res;
    // }));
  }
}
