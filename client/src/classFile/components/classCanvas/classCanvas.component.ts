import {Component, OnInit, AfterViewInit, Inject} from '@angular/core';
import {PaperService} from "../../../common/paper/paper.service";
import {EDITOR_DATA, EDITOR_DATA_TYPE, PaperCanvasComponent} from "../../../common/paper/paperCanvas.component";
import {ToolService} from "../../../common/services/tools.service";
import {SelectionTool} from "../../tools/selection.tool";
import {NewClassTool} from "../../tools/newClass.tool";
import {AssocRelationTool} from "../../tools/assocRelation.tool";
import {InheritRelationTool} from "../../tools/inheritRelation.tool";
import {ClassFileDrawingService} from "../../services/classFileDrawing.service";
import {Actions, Select, Store} from "@ngxs/store";
import {PropertyItem} from "../../../common/components/property-editor/PropertyItem";
import {AppState} from "../../../app/state/app.state";
import {FileEntity} from "../../../common/models";
import {PatchClass} from "../../state/classFile.actions";

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

  properties: PropertyItem[] = [
    {key:"name", name: "Name", type: "text"},
    {key:"attrs", name: "Attributes", type: "textarea"}
  ];

  selectedEntities: FileEntity[];

  constructor(protected paperService: PaperService,
              protected toolService: ToolService,
              protected drawingService: ClassFileDrawingService,
              @Inject(EDITOR_DATA) protected editorData: EDITOR_DATA_TYPE,
              protected store: Store,
              protected actions$: Actions) {
    super(paperService, toolService, drawingService, editorData, store, actions$);

    toolService.registerTool(SelectionTool);
    toolService.registerTool(NewClassTool);
    toolService.registerTool(AssocRelationTool);
    toolService.registerTool(InheritRelationTool);
  }

  ngOnInit() {
    super.ngOnInit();

    this.store.select(AppState.selectedEntities).subscribe(entities => {
      this.selectedEntities = entities;
    });
  }

  onPropertyChanged({key, value}) {
    let ids = this.selectedEntities.map(e => e.id);
    this.store.dispatch(new PatchClass(this.paperService.fileId, {[key]: value}, ids));
  }
}
