import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  ErrorStateMatcher,
  MatButtonModule, MatCardModule,
  MatDialogModule, MatDividerModule, MatExpansionModule, MatIconModule, MatInputModule, MatListModule, MatSidenavModule,
  MatToolbarModule, ShowOnDirtyErrorStateMatcher
} from "@angular/material";

import { NgxModelModule } from "ngx-model";

import { AppComponent } from './app.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { EditorComponent } from './editor/editor.component';
import { ProjectService } from "./project.service";
import { AppRoutingModule } from './app-routing.module';
import { OutletWrapperComponent } from './outlet-wrapper/outlet-wrapper.component';
import { FileListComponent } from './file-list/file-list.component';
import { DrawingListComponent } from './drawing-list/drawing-list.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NewDialogComponent } from './new-dialog/new-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    // ProjectListComponent,
    EditorComponent,
    OutletWrapperComponent,
    // FileListComponent,
    DrawingListComponent,
    ConfirmDialogComponent,
    NewDialogComponent,
  ],
  entryComponents: [
    ConfirmDialogComponent,
    NewDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxModelModule,
    //Angular Material
    MatDialogModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    MatCardModule,
    MatInputModule
  ],
  providers: [
    ProjectService,
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}
  ],
  bootstrap: [OutletWrapperComponent]
})
export class AppModule { }
