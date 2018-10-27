import {Injectable} from "@angular/core";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {DrawingTool} from "../../common/paper/drawingTool.tool";
import {PaperService} from "../../common/paper/paper.service";

@Injectable()
export class InheritRelationTool extends DrawingTool {
  name = 'Inherit Relation';
  icon = 'rel-inherit';
  toolTip = 'Adds an inherit relation between two classes';

  constructor(paperService: PaperService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    super(paperService, iconRegistry, sanitizer);
    this.registerIcon();
  }

  onMouseUp = (event) => {

  }
}
