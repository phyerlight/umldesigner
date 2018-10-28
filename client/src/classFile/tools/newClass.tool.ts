import {Injectable, NgZone} from "@angular/core";
import {MatDialog, MatDialogRef, MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {DrawingTool} from "../../common/paper/drawingTool.tool";
import {ClassFormComponent} from "../components/class-form/class-form.component";
import {take, filter} from "rxjs/operators";
import {PaperCanvasComponent} from "../../common/paper/paperCanvas.component";
import {List} from "immutable";
import {PaperService} from "../../common/paper/paper.service";

@Injectable()
export class NewClassTool extends DrawingTool {
  name = 'Class';
  icon = 'class';
  toolTip = 'Adds a class to the drawing';

  constructor(paperService: PaperService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer,
              private classDialog: MatDialog,
              private ngZone: NgZone) {
    super(paperService, iconRegistry, sanitizer);
    this.registerIcon();
  }

  onMouseUp = (event: paper.ToolEvent) => {
    // this.canvasService.getActiveCanvas().pipe(take(1)).subscribe((pc: DesignCanvasComponent) => {
    //   this.ngZone.run(() => {
    //     let dialogRef = this.classDialog.open(ClassFormComponent, {
    //       data: {
    //         'new': true,
    //         'cls': new Class()
    //       }
    //     });
    //
    //     dialogRef.afterClosed().pipe(filter(result => result!=null)).subscribe((result: Class) => {
    //       let f = pc.data as FileData;
    //
    //       result = result.with({position: new Point({x: event.point.x, y: event.point.y})});
    //
    //       pc.updateData( f.with({classes: f.classes.push(result)}));
    //     });
    //   });
    // });
  }
}
