import { Component, OnInit } from '@angular/core';
import {Actions, ofActionSuccessful, Store} from "@ngxs/store";
import {Navigate, RouterNavigation} from "@ngxs/router-plugin";
import {distinctUntilKeyChanged, filter, flatMap, ignoreElements, map, mergeMap} from "rxjs/operators";
import {RouteParams} from "../../app-routing.module";
import {Project} from "../../models/Project";
import {ProjectState} from "../../state/project.state";
import {combineLatest, concat} from "rxjs";
import {File} from "../../../common/models";
import {exists} from "../../../common";
import {Selection} from "../app/app.component";
import {OpenFile, SetActiveFile} from "../../state/app.actions";
import {AppState} from "../../state/app.state";
import {LoadFile} from "../../../common/state/file.actions";

@Component({
  selector: 'app-outlet-wrapper',
  templateUrl: './outlet-wrapper.component.html',
  styleUrls: ['./outlet-wrapper.component.css']
})
export class OutletWrapperComponent implements OnInit {

  constructor(protected actions$: Actions,
              protected store: Store) { }

  ngOnInit() {
    this.actions$.pipe(
      ofActionSuccessful(RouterNavigation),
      map((nav: RouterNavigation) => {
        return nav.routerState.root.firstChild.params;
      }),
      filter((p: RouteParams) => exists(p.project, p.file)),
      flatMap((params: RouteParams) => {
        return this.store.selectOnce(ProjectState.projectFileByName).pipe(
          map(fn => fn(params.project, params.file))
          // filter(f => f != null)
        );
      }),
      distinctUntilKeyChanged("_key")
    ).subscribe((file: File) => {
      if (!exists(file)) {
        this.store.dispatch(new Navigate(['']));
      } else {
        this.store.dispatch(new SetActiveFile(file._key));
        if (!this.store.selectSnapshot(AppState.isFileOpen)(file._key)) {
          this.store.dispatch(new LoadFile(file._key)).subscribe(() => {
            this.store.dispatch(new OpenFile(file._key));
          });
        }
      }
    });
  }

}
