import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { EditorComponent } from './editor/editor.component';
import { ProjectService } from "./project.service";
import { AppRoutingModule } from './app-routing.module';
import { OutletWrapperComponent } from './outlet-wrapper/outlet-wrapper.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectListComponent,
    EditorComponent,
    OutletWrapperComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [ProjectService],
  bootstrap: [OutletWrapperComponent]
})
export class AppModule { }
