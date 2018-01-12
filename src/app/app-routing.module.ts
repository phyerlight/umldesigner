import { NgModule } from '@angular/core';
import {Params, RouterModule, Routes} from "@angular/router";
import {AppComponent} from "./app.component";

export interface RouteParams extends Params {
  project: string,
  file: string
}

const routes: Routes = [
  { path: '', component: AppComponent},
  { path: ':project', component: AppComponent},
  { path: ':project/:file', component: AppComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
