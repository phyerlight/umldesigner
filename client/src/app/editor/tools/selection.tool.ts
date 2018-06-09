import {Injectable} from "@angular/core";
import {DRAWING_TOOL_DEPS, DrawingTool, ToolService} from "../tools.service";
import {CanvasService} from "../canvas.service";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import Rectangle = paper.Rectangle;
import Point = paper.Point;
import Size = paper.Size;

@Injectable()
export class SelectionTool extends DrawingTool {
  name = 'Selection';
  icon = 'mouse-pointer';
  toolTip = 'Select items in the drawing';

  constructor(canvasService: CanvasService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    super(canvasService, iconRegistry, sanitizer);
    this.registerIcon();
  }

  private activeItem = null;
  onMouseDown = (event: paper.ToolEvent) => {
    let cls = null;

    this.canvasService.getActiveCanvas().take(1).subscribe((c) => {
      cls = c.project.getItem({match: (item) => {
          if (item.data && item.data.type && item.data.type == 'class') {
            return item.bounds.contains(event.point);
          }
        },
        data: {type: 'class'}
      });
    });

    if (cls != null) {
      cls.children['selector'].selected = true;
      cls.pivot = event.point;
      this.activeItem = cls;
    } else {
      this.activeItem = null;
      this.canvasService.getActiveCanvas().take(1).subscribe((c) => {
        c.project.deselectAll();
      });
    }
  };

  onMouseUp = (event) => {
    this.activeItem = null;
  };

  onMouseDrag = (event) => {
    this.canvasService.getActiveCanvas().take(1).subscribe((c) => {
      if (this.activeItem && c.project.view.bounds.contains(event.point))
        this.activeItem.position = this.activeItem.position.add(event.delta);
    });
  };

  findParentClass(item: paper.Item): paper.Item {
    if (item && item.data && item.data.type && item.data.type == 'class') {
      return item;
    } else if(item.className == 'Layer') {
      return null;
    } else {
      return this.findParentClass(item.parent);
    }
  }

}
ToolService.addToolProvider({provide: SelectionTool, deps: DRAWING_TOOL_DEPS});
