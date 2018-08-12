import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  ErrorStateMatcher,
  MatButtonModule, MatButtonToggleModule, MatCardModule,
  MatDialogModule, MatDividerModule, MatExpansionModule, MatIconModule, MatInputModule, MatListModule, MatSidenavModule,
  MatToolbarModule, MatTooltipModule, ShowOnDirtyErrorStateMatcher
} from "@angular/material";

import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { ProjectService } from "./project.service";
import { AppRoutingModule } from './app-routing.module';
import { OutletWrapperComponent } from './outlet-wrapper/outlet-wrapper.component';
import { DrawingListComponent } from './drawing-list/drawing-list.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NewDialogComponent } from './new-dialog/new-dialog.component';
import {PaperCanvasComponent} from "./editor/paperCanvas.component";
import {HttpClientModule} from "@angular/common/http";
import {FileService} from "./file.service";
import {ToolService} from "./editor/tools.service";
import {CanvasService} from "./editor/canvas.service";
import { ClassFormComponent } from './editor/forms/class-form/class-form.component';
import {DesignCanvasComponent} from "./editor/designCanvas.component";

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    OutletWrapperComponent,
    DrawingListComponent,
    PaperCanvasComponent,
    DesignCanvasComponent,
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
    MatTooltipModule
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
