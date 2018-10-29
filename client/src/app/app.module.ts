import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  ErrorStateMatcher,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSidenavModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  ShowOnDirtyErrorStateMatcher
} from "@angular/material";
import {PortalModule} from '@angular/cdk/portal'

import { AppComponent } from './containers/app/app.component';
import { EditorComponent } from './containers/editor/editor.component';
import { ProjectService } from "./services/project.service";
import { AppRoutingModule } from './app-routing.module';
import { OutletWrapperComponent } from './containers/outlet-wrapper/outlet-wrapper.component';
import { DrawingListComponent } from './components/drawing-list/drawing-list.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { NewDialogComponent } from './components/new-dialog/new-dialog.component';
import {HttpClientModule} from "@angular/common/http";
import {FileService} from "./services/file.service";
import { ClassFormComponent } from '../classFile/components/class-form/class-form.component';
import {NgxsModule} from "@ngxs/store";
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsRouterPluginModule} from "@ngxs/router-plugin";
import {AllFileStates, FileState} from "../common/state/file.state";
import {ClassFileModule} from "../classFile/classFile.module";
import {ProjectState} from "./state/project.state";

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    OutletWrapperComponent,
    DrawingListComponent,
    // DesignCanvasComponent,
    ConfirmDialogComponent,
    NewDialogComponent,
    ClassFormComponent,
  ],
  entryComponents: [
    ConfirmDialogComponent,
    NewDialogComponent,
    ClassFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // NoopAnimationsModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxsModule.forRoot([
      ProjectState,
      FileState,
      ...AllFileStates
    ]),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({name: 'URLDesigner'}),
    ClassFileModule,
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
    MatInputModule,
    MatButtonToggleModule,
    MatTooltipModule,
    PortalModule,
    MatTabsModule
  ],
  providers: [
    ProjectService,
    FileService,
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    // ToolService,
    // CanvasService,
  ],
  bootstrap: [OutletWrapperComponent]
})
export class AppModule { }
