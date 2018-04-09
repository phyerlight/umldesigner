import {Injectable} from "@angular/core";
import {DRAWING_TOOL_DEPS, DrawingTool, ToolService} from "../tools.service";
import {CanvasService} from "../canvas.service";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable()
export class InheritRelationTool extends DrawingTool {
  name = 'Inherit Relation';
  icon = 'rel-inherit';
  toolTip = 'Adds an inherit relation between two classes';

  constructor(canvasService: CanvasService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    super(canvasService, iconRegistry, sanitizer);
    this.registerIcon();
  }

  onMouseUp = (event) => {

  }
}
ToolService.addToolProvider({provide: InheritRelationTool, deps: DRAWING_TOOL_DEPS});
