import {Injectable} from "@angular/core";
// import {DRAWING_TOOL_DEPS, ToolService} from "../tools.service";
import {CanvasService} from "../canvas.service";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {DrawingTool} from "./drawingTool.tool";

@Injectable()
export class AssocRelationTool extends DrawingTool {
  name = 'Association Relation';
  icon = 'rel-assoc';
  toolTip = 'Adds an association relation between two classes';

  constructor(canvasService: CanvasService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    super(canvasService, iconRegistry, sanitizer);
    this.registerIcon();
  }

  onMouseUp = (event) => {

  }
}
