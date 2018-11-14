import {Injectable, OnDestroy} from "@angular/core";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
// import {DrawingTool} from "../../common/paper/drawingTool.tool";
import {PaperService} from "../../common/paper/paper.service";
import {Store} from "@ngxs/store";
// import {AddRelation} from "../state/classFile.actions";
import {ClassFileEntityType, RelationType} from "../models";
// import {FileEntity} from "../../common/models";
import {RelationTool} from "./relation.tool";

@Injectable()
export class InheritRelationTool extends RelationTool {
  name = 'Inherit Relation';
  icon = 'rel-inherit';
  toolTip = 'Adds an inherit relation between two classes';
  relationType = RelationType.Inherit;

  constructor(paperService: PaperService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer,
              store: Store) {
    super(paperService, iconRegistry, sanitizer, store);
    this.registerIcon();
  }

  // private startItem: FileEntity = null;
  //
  // ngOnDestroy() {
  //   this.startItem = null;
  // }
  //
  // onMouseUp = (event: paper.ToolEvent) => {
  //   if (event.item) {
  //     if (this.startItem != null) {
  //       this.store.dispatch(new AddRelation(this.paperService.fileId, {
  //         type: ClassFileEntityType.Relation,
  //         reltype: RelationType.Inherit,
  //         fromId: this.startItem.id,
  //         toId: event.item.data.id
  //       }));
  //     } else {
  //       this.startItem = event.item.data;
  //     }
  //   }
  // }
}
