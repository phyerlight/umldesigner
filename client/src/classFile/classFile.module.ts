import { CommonModule } from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
    ErrorStateMatcher,
    MatButtonModule, MatButtonToggleModule, MatCardModule,
    MatDialogModule, MatDividerModule, MatExpansionModule, MatIconModule, MatInputModule, MatListModule, MatSidenavModule,
    MatToolbarModule, MatTooltipModule, ShowOnDirtyErrorStateMatcher
} from "@angular/material";
import {HttpClientModule} from "@angular/common/http";
import './state/classFile.state';
// import {registerFileType} from "../common/models";
// import {CLASS_FILE_TYPE} from "./models";
// import {ClassFileState} from "./state/classFile.state";

import { ClassFormComponent } from './components/class-form/class-form.component';
import {ClassCanvasComponent} from "./components/classCanvas/classCanvas.component";

@NgModule({
    declarations: [
      ClassCanvasComponent,
      ClassFormComponent
    ],
    exports: [
      ClassCanvasComponent
    ],
    entryComponents: [
      ClassCanvasComponent
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
