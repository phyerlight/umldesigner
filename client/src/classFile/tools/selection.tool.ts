import {Injectable} from "@angular/core";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import { take } from "rxjs/operators";
import Rectangle = paper.Rectangle;
import Point = paper.Point;
import Size = paper.Size;
import {DrawingTool} from "../../common/paper/drawingTool.tool";
import {PaperService} from "../../common/paper/paper.service";

@Injectable()
export class SelectionTool extends DrawingTool {
  name = 'Selection';
  icon = 'mouse-pointer';
  toolTip = 'Select items in the drawing';

  constructor(paperService: PaperService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    super(paperService, iconRegistry, sanitizer);
    this.registerIcon();
  }

  private activeItem = null;
  onMouseDown = (event: paper.ToolEvent) => {
    //   });
    // });
    //
    // if (cls != null) {
    //   cls.children['selector'].selected = true;
    //   cls.pivot = event.point;
    //   this.activeItem = cls;
    // } else {
    //   this.activeItem = null;
    //   this.canvasService.getActiveCanvas().pipe(take(1)).subscribe((c) => {
    //     c.project.deselectAll();
    //   });
    // }
  };

  onMouseUp = (event) => {
    this.activeItem = null;
  };

  onMouseDrag = (event) => {
  //   this.canvasService.getActiveCanvas().pipe(take(1)).subscribe((c) => {
  //     if (this.activeItem && c.project.view.bounds.contains(event.point))
  //       this.activeItem.position = this.activeItem.position.add(event.delta);
  //   });
  // };
  //
  // findParentClass(item: paper.Item): paper.Item {
  //   if (item && item.data && item.data.type && item.data.type == 'class') {
  //     return item;
  //   } else if(item.className == 'Layer') {
  //     return null;
  //   } else {
  //     return this.findParentClass(item.parent);
  //   }
  }

}