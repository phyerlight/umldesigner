import {Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, Inject} from '@angular/core';
import {PaperService} from "../../../common/paper/paper.service";
import {EDITOR_DATA, EDITOR_DATA_TYPE, PaperCanvasComponent} from "../../../common/paper/paperCanvas.component";
import {ToolService} from "../../../common/services/tools.service";
import {SelectionTool} from "../../tools/selection.tool";
import {NewClassTool} from "../../tools/newClass.tool";
import {AssocRelationTool} from "../../tools/assocRelation.tool";
import {InheritRelationTool} from "../../tools/inheritRelation.tool";
import {ClassFileDrawingService} from "../../services/classFileDrawing.service";
import {Store} from "@ngxs/store";

@Component({
  styles: ['canvas {width: 100%; height: 100%}'],
  selector: 'class-canvas',
  templateUrl: './classCanvas.component.html',
  providers: [
    ToolService,
    PaperService,
    ClassFileDrawingService,

    SelectionTool,
    NewClassTool,
    AssocRelationTool,
    InheritRelationTool
  ]
})
export class ClassCanvasComponent extends PaperCanvasComponent implements OnInit, AfterViewInit {

  constructor(protected paperService: PaperService,
              protected toolService: ToolService,
              protected drawingService: ClassFileDrawingService,
              @Inject(EDITOR_DATA) protected editorData: EDITOR_DATA_TYPE,
              protected store: Store) {
    super(paperService, toolService, drawingService, editorData, store);

    toolService.registerTool(SelectionTool);
    toolService.registerTool(NewClassTool);
    toolService.registerTool(AssocRelationTool);
    toolService.registerTool(InheritRelationTool);
  }
}
