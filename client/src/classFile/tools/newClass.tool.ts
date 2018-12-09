import {Injectable, NgZone} from "@angular/core";
import {MatDialog, MatDialogRef, MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {DrawingTool} from "../../common/paper/drawingTool.tool";
import {PaperService} from "../../common/paper/paper.service";
import {Store} from "@ngxs/store";
import {AddEntity} from "../../common/state/file.actions";
import {ClassEntity, createClassEntity} from "../models";

@Injectable()
export class NewClassTool extends DrawingTool {
  name = 'Class';
  icon = 'class';
  toolTip = 'Adds a class to the drawing';

  constructor(paperService: PaperService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer,
              private classDialog: MatDialog,
              private ngZone: NgZone,
              protected store: Store) {
    super(paperService, iconRegistry, sanitizer);
    this.registerIcon();
  }

  onMouseUp = (event: paper.ToolEvent) => {
    let currentFileKey = this.paperService.fileId;
    this.store.dispatch(new AddEntity<ClassEntity>(currentFileKey, createClassEntity({
      metadata : {
        location: {x: event.point.x , y: event.point.y},
        width: null,
        height: null
      },
      name: null
    })));
  }
}
