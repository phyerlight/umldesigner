import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    ErrorStateMatcher,
    MatButtonModule, MatButtonToggleModule, MatCardModule,
    MatDialogModule, MatDividerModule, MatExpansionModule, MatIconModule, MatInputModule, MatListModule, MatSidenavModule,
    MatToolbarModule, MatTooltipModule, ShowOnDirtyErrorStateMatcher
} from "@angular/material";
import {HttpClientModule} from "@angular/common/http";

import {ClassCanvasComponent} from "./components/classCanvas.component";
import './state/classFile.state';

@NgModule({
    declarations: [
      ClassCanvasComponent,
    ],
    exports: [
      ClassCanvasComponent
    ],
    entryComponents: [
    ],
    imports: [
        CommonModule,
        FormsModule,
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
    providers: []
})
export class ClassFileModule { }
