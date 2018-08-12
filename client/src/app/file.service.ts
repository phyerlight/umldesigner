import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {HttpClient} from "@angular/common/http";
import {distinctUntilChanged, filter, map, mergeAll, publishReplay, refCount, share, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {Project} from "./project.service";
import { environment } from "../environments/environment";
import * as _ from "lodash";
import { Map, List, Record } from 'immutable';

type PointParams = {
  x?: number,
  y?: number
}

export class Point extends Record({x: 0, y: 0}, "Point") {
  x: number;
  y: number;

  constructor(params?: PointParams) {
    params ? super(params) : super();
  }

  with(values: PointParams) {
    return this.merge(values) as this;
  }
}

type ClassParams = {
  id?: number,
  position?: Point,
  name?: string,
  attrs?: List<string>
}

export class Class extends Record({id: 0, position: new Point(), name: "", attrs: List<string>()}, "Class") {
  id: number;
  position: Point;
  name: string;
  attrs: List<string>;

  constructor(params?: ClassParams) {
    if (params) {
      if (params.position && !(params.position instanceof Point)) {
        params.position = new Point(params.position);
      }
      if (params.attrs && !(params.attrs instanceof List)) {
        params.attrs = List<string>(params.attrs);
      }
      super(params);
    } else {
      super();
    }
  }

  with(values: ClassParams) {
    return this.merge(values) as this;
  }
}

type RelationParams = {
  type: string,
  fromId: number,
  toId: number
}

export class Relation extends Record({type: "", fromId: null, toId: null}, "Relation") {
  type: string;
  fromId: number;
  toId: number;

  constructor(params?: RelationParams) {
    params ? super(params) : super();
  }

  with(values: RelationParams) {
    return this.merge(values) as this;
  }
}

type FileDataParams = {
  classes?: List<Class>,
  relations?: List<Relation>
}

export class FileData extends Record({classes: List<Class>(), relations: List<Relation>()}, "FileData") {
  classes?: List<Class>;
  relations?: List<Relation>;

  constructor(params?: FileDataParams) {
    if (params) {
      if (params.classes && !(params.classes instanceof List)) {
        params.classes.forEach((v)=>{
          return new Class(v);
        });
        params.classes = List<Class>(params.classes);
      }
      if (params.relations && !(params.relations instanceof List)) {
        params.relations.forEach((v)=>{
          return new Relation(v);
        });
        params.relations = List<Relation>(params.relations);
      }
      super(params);
    } else {
      super();
    }
  }

  with(values: FileDataParams) {
    return this.merge(values) as this;
  }
}

type FileParams = {
  _key?: string,
  project_key?: string,
  name?: string,
  data?: FileData,
}

export class File extends Record({_key: null, project_key: null, name: "", data: new FileData()}, "File") {
  _key: string;
  project_key: string;
  name: string;
  data: FileData;

  constructor(params?: FileParams) {
    if (params) {
      if (params.data && !(params.data instanceof FileData)) {
        params.data = new FileData(params.data);
      }
      super(params);
    } else {
      super();
    }
  }

  with(values: FileParams) {
    return this.merge(values) as this;
  }

  calcNewClsId(): number {
    return this.data.classes.map(c => c.id)
      .reduce((p: number, c: number) => Math.max(p, c), 0)+1
  }

  /**
   * Put a new or existing class into the class list. If new, a class Id will be set. If existing, it will replace the
   * current entry in its entirety.
   * @param cls Class to be entered.
   */
  putClass(cls: Class): File {
    /**
     * Push the new class onto the end of the classes list.
     * @param cls
     */
    let addCls = function(cls) {
      return this.updateIn(
        ['data', 'classes'],
        (v: List<Class>) => v.push(cls)
      ) as File;
    }.bind(this);

    //Existence is determined by it having an Id or not.
    if (cls.id) {
      //Determine it's location in the list
      let clsIndex = this.data.classes.findKey(c => c.id == cls.id);
      if (clsIndex) {
        //Update the location with the new value
        return this.updateIn(
          ['data', 'classes'],
          (clses: List<Class>) => clses.update(clsIndex, (oldCls)=>cls)
        ) as File;
      } else {
        //if for some reason, it doesn't actually exist, just add it in as is since the Id doesn't exist here. There
        // could be something going on with a possibly copied (as in clipboard) value that this may actually make sense.
        return addCls(cls);
      }
    } else {
      //Otherwise, calculate a new class Id and add it to the end.
      return addCls(cls.with({'id': this.calcNewClsId()}));
    }
  }
}

@Injectable()
export class FileService {

  private url = environment.host+environment.database+'/files';

  private _files: BehaviorSubject<Map<string, File>> = new BehaviorSubject<Map<string, File>>(Map());
  // public files$: Observable<Map<string, File>> = this._files.asObservable().pipe(filter(v => v != null));

  constructor(private http: HttpClient) { }

  /**
   * Actually fetches a file from the server. Shares the subscription to make sure that multple fetches aren't sent
   * simultaneously.
   * @param {string} key
   * @return {Observable<File>}
   * @private
   */
  protected _fetchFile(key: string): Observable<File> {
    return this.http.get(this.url+'/'+key).pipe(
      map((f: FileParams)=>new File(f)),
      share()
    );
  }

  /**
   * Method to re-fetch a file that may already be in the cache.
   * @param {string} key
   * @return {Observable<File>}
   */
  public fetchFile(key: string): Observable<File> {
    let o = this._fetchFile(key);
    o.subscribe((f: File) => {
      this._files.next(this._files.getValue().update(key, v=>f));
    });
    return o;
  }

  /* Keyed subscriptions to files */
  private subs = {};
  /**
   * Gets a file by key. This function will check if there is a cached value and if not, fetch a value from the server.
   * @param {string} key
   * @return {Observable<File>}
   */
  public getFileByKey(key: string): Observable<File> {
    if (!this.subs[key]) {
      this.subs[key] = this._files.pipe(
        map((h: Map<string, File>) => {
          return h.get(key);
        }),
        distinctUntilChanged(),
        map(f => {
          if (f == undefined) {
            return this._fetchFile(key);
          } else {
            return of(f)
          }
        }),
        mergeAll(),
        publishReplay(),
        refCount()
        // filter(v => v!=null)
      );
    }
    return this.subs[key];
  };

  // public getFileByKey(keys: string[]): Observable<File[]> {
  //   return this.file$.pipe(map((files: File[]) => {
  //     return files.filter(f => keys.includes(f._key));
  //   }));
  // };

  static createFile(name: string, project: Project): File {
    return new File({
      project_key: project._key,
      name: name,
    });
  }

  static putFileClass(file: File, newCls: Class) {
    if (newCls.id) {
      let cls = file.data.classes.find(c => c.id == newCls.id);
      if (cls) {
        _.assign(cls, newCls);
      }
    } else {
      newCls.id = file.data.classes.map(c => c.id).reduce((p: number, c: number) => Math.max(p, c), 0)+1;
      file.data.classes.push(newCls);
    }
  }

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
  }

  public delete(file: File): Observable<any> {
    return this.http.delete(this.url+'/'+file._key, {
      withCredentials: true
    });
  }
}
