import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { EditorComponent } from './editor/editor.component';
import { ProjectService } from "./project.service";
import { AppRoutingModule } from './app-routing.module';
import { OutletWrapperComponent } from './outlet-wrapper/outlet-wrapper.component';
import { NgxModelModule } from "ngx-model";
import { FileListComponent } from './file-list/file-list.component';

import {AccordionModule, DropdownModule, ScrollPanelModule, ToolbarModule} from "primeng/primeng";
import { ButtonModule } from "primeng/button";
import { ListboxModule } from "primeng/listbox";
import { DrawingListComponent } from './drawing-list/drawing-list.component';
import {PanelModule} from "primeng/panel";
import {CardModule} from "primeng/card";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";

@NgModule({
  declarations: [
    AppComponent,
    ProjectListComponent,
    EditorComponent,
    OutletWrapperComponent,
    FileListComponent,
    DrawingListComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    NgxModelModule,
    //PrimeNG
    DropdownModule,
    ButtonModule,
    ListboxModule,
    ScrollPanelModule,
    PanelModule,
    AccordionModule,
    ToolbarModule,
    CardModule,
    ConfirmDialogModule
  ],
  providers: [
    ProjectService,
    ConfirmationService
  ],
  bootstrap: [OutletWrapperComponent]
})
export class AppModule { }
