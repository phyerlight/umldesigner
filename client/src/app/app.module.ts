import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import {APP_INITIALIZER, Injector, NgModule} from '@angular/core';
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
import {HttpClientModule} from "@angular/common/http";

import {NGXS_PLUGINS, NgxsModule, Store} from "@ngxs/store";
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsRouterPluginModule} from "@ngxs/router-plugin";

//All the sub file states need to be imported before AppComponent to keep FileState from being loaded before them.
import {ClassFileModule} from "../classFile/classFile.module";

import { AppComponent } from './containers/app/app.component';
import { EditorComponent } from './containers/editor/editor.component';
import { OutletWrapperComponent } from './containers/outlet-wrapper/outlet-wrapper.component';
import { DrawingListComponent } from './components/drawing-list/drawing-list.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { NewDialogComponent } from './components/new-dialog/new-dialog.component';
import { ProjectService } from "./services/project.service";
import {appProjectListInitializer} from "./services/appProjectList.Initializer";
import {AppRouterPlugin} from "./services/appRouter.plugin";
import { AppRoutingModule } from './app-routing.module';
import {ProjectState} from "./state/project.state";
import {AppState} from "./state/app.state";

import {FileService} from "../common/services/file.service";
import {FileState} from "../common/state/file.state";
import {AllFileStates} from "../common";

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    OutletWrapperComponent,
    DrawingListComponent,
    ConfirmDialogComponent,
    NewDialogComponent
  ],
  entryComponents: [
    ConfirmDialogComponent,
    NewDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ClassFileModule,
    AppRoutingModule,
    NgxsModule.forRoot([
      AppState,
      ProjectState,
      FileState,
      ...AllFileStates
    ]),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({name: 'URLDesigner'}),
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
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: appProjectListInitializer,
      deps: [Store, ProjectService]
    },
    {
      provide: NGXS_PLUGINS,
      multi: true,
      useClass: AppRouterPlugin,
      deps: [Injector]
    },
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
  ],
  bootstrap: [OutletWrapperComponent]
})
export class AppModule { }
