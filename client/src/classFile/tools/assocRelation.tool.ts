import {Injectable} from "@angular/core";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {DrawingTool} from "../../common/paper/drawingTool.tool";
import {PaperService} from "../../common/paper/paper.service";
import {RelationTool} from "./relation.tool";
import {RelationType} from "../models";
import {Store} from "@ngxs/store";

@Injectable()
export class AssocRelationTool extends RelationTool {
  name = 'Association Relation';
  icon = 'rel-assoc';
  toolTip = 'Adds an association relation between two classes';
  relationType = RelationType.Assoc;

  constructor(paperService: PaperService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer,
              store: Store) {
    super(paperService, iconRegistry, sanitizer, store);
    this.registerIcon();
  }

  // onMouseUp = (event) => {
  //
  // }
}
