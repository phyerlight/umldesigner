import {Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit} from '@angular/core';
import {PaperService} from "../../../common/paper/paper.service";
import {PaperCanvasComponent} from "../../../common/paper/paperCanvas.component";
import {ToolService} from "../../../app/containers/editor/tools.service";
import {SelectionTool} from "../../tools/selection.tool";
import {NewClassTool} from "../../tools/newClass.tool";
import {AssocRelationTool} from "../../tools/assocRelation.tool";
import {InheritRelationTool} from "../../tools/inheritRelation.tool";

@Component({
  styles: ['canvas {width: 100%; height: 100%}'],
  selector: 'class-canvas',
  templateUrl: './classCanvas.component.html',
  providers: [
    ToolService,
    PaperService,

    SelectionTool,
    NewClassTool,
    AssocRelationTool,
    InheritRelationTool
  ]
})
export class ClassCanvasComponent extends PaperCanvasComponent implements OnInit, AfterViewInit {

  constructor(protected paperService: PaperService,
              protected toolService: ToolService) {
    super(paperService, toolService);
  }
}