import { NgModule } from '@angular/core';
import {Params, RouteReuseStrategy, RouterModule, Routes, ActivatedRouteSnapshot} from "@angular/router";
import {AppComponent} from "./app.component";
import {DetachedRouteHandle} from '@angular/router/src/route_reuse_strategy';

export interface RouteParams extends Params {
  project: string,
  file: string
}

export const routes: Routes = [
  { path: '', component: AppComponent},
  { path: ':project', redirectTo: '' },
  { path: ':project/:file', component: AppComponent}
];

export class CustomRouteReuseStrategy extends RouteReuseStrategy {
  shouldDetach(route: ActivatedRouteSnapshot): boolean { return false; }
  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {}
  shouldAttach(route: ActivatedRouteSnapshot): boolean { return false; }
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle|null { return null; }
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean { return true; }
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy}
  ]
})
export class AppRoutingModule { }
