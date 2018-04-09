import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  ErrorStateMatcher,
  MatButtonModule, MatButtonToggleModule, MatCardModule,
  MatDialogModule, MatDividerModule, MatExpansionModule, MatIconModule, MatInputModule, MatListModule, MatSidenavModule,
  MatToolbarModule, MatTooltipModule, ShowOnDirtyErrorStateMatcher
} from "@angular/material";

import { NgxModelModule } from "ngx-model";

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
// import {ToolService} from "./editor/tools.service";
// import {CanvasService} from "./editor/canvas.service";

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    OutletWrapperComponent,
    DrawingListComponent,
    PaperCanvasComponent,
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
    {provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher},
    // ToolService,
    // CanvasService,
  ],
  bootstrap: [OutletWrapperComponent]
})
export class AppModule { }
