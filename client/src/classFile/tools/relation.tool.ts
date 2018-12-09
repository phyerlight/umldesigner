import {OnDestroy} from "@angular/core";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {DrawingTool} from "../../common/paper/drawingTool.tool";
import {PaperService} from "../../common/paper/paper.service";
import {Store} from "@ngxs/store";
import {createRelationEntity, RelationEntity, RelationType} from "../models";
import {FileEntity} from "../../common/models";
import {AddEntity} from "../../common/state/file.actions";

export abstract class RelationTool extends DrawingTool implements OnDestroy {
  name = 'Inherit Relation';
  icon = 'rel-inherit';
  toolTip = 'Adds an inherit relation between two classes';
  relationType: RelationType = null;

  constructor(paperService: PaperService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer,
              protected store: Store) {
    super(paperService, iconRegistry, sanitizer);
    this.registerIcon();
  }

  private startItem: FileEntity = null;

  ngOnDestroy() {
    this.startItem = null;
  }

  onMouseUp = (event: paper.ToolEvent) => {
    if (event.item) {
      if (this.startItem != null) {
        this.store.dispatch(new AddEntity<RelationEntity>(this.paperService.fileId, createRelationEntity({
          reltype: this.relationType,
          fromId: this.startItem.id,
          toId: event.item.data.id
        })));
        this.startItem = null;
      } else {
        this.startItem = event.item.data;
      }
    }
  };

  onDeactivate = () => {
    this.startItem = null;
  };
}
