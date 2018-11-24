import {Injectable, NgZone} from "@angular/core";
import {MatDialog, MatDialogRef, MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {DrawingTool} from "../../common/paper/drawingTool.tool";
// import {ClassFormComponent} from "../components/class-form/class-form.component";
// import {take, filter} from "rxjs/operators";
// import {PaperCanvasComponent} from "../../common/paper/paperCanvas.component";
import {PaperService} from "../../common/paper/paper.service";
import {Store} from "@ngxs/store";
import {AddClass} from "../state/classFile.actions";
import {AppState} from "../../app/state/app.state";

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
    this.store.dispatch(new AddClass(currentFileKey, {
      metadata : {
        location: {x: event.point.x , y: event.point.y},
        width: null,
        height: null
      }
    }));
  }
}
