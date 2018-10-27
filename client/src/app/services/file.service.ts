import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {HttpClient} from "@angular/common/http";
import {distinctUntilChanged, filter, map, mergeAll, publishReplay, refCount, share, tap} from 'rxjs/operators';
import {of} from 'rxjs';
import {Project} from "../models/Project";
import { environment } from "../../environments/environment";
import * as _ from "lodash";
import { Map, List, Record } from 'immutable';
import { File } from "../../common/models";

@Injectable()
export class FileService {

  private url = environment.host+environment.database+'/files';

  constructor(private http: HttpClient) { }

  /**
   * Actually fetches a file from the server. Shares the subscription to make sure that multple fetches aren't sent
   * simultaneously.
   * @param {string} key
   * @return {Observable<File>}
   * @private
   */
  protected _fetchFile(key: string): Observable<File> {
    return this.http.get(this.url+'/'+key) as Observable<File>;
    //     .pipe(
    //   map(f => f as File)
    // );
  }

  /**
   * Method to re-fetch a file that may already be in the cache.
   * @param {string} key
   * @return {Observable<File>}
   */
  public fetchFile(key: string): Observable<File> {
    return this._fetchFile(key);
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
