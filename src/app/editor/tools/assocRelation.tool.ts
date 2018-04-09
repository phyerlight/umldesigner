import {Injectable} from "@angular/core";
import {DRAWING_TOOL_DEPS, DrawingTool, ToolService} from "../tools.service";
import {CanvasService} from "../canvas.service";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";

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
ToolService.addToolProvider({provide: AssocRelationTool, deps: DRAWING_TOOL_DEPS});
