import {Injectable} from "@angular/core";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {DrawingTool} from "../../common/paper/drawingTool.tool";
import {PaperService} from "../../common/paper/paper.service";

// import paper from 'paper';
import {Store} from "@ngxs/store";
import {ClassEntity, ClassFileEntityType} from "../models";
import {SetSelection} from "../../app/state/app.actions";
import {PatchClassMetaData} from "../state/classFile.actions";
import {AppState} from "../../app/state/app.state";

@Injectable()
export class SelectionTool extends DrawingTool {
  name = 'Selection';
  icon = 'mouse-pointer';
  toolTip = 'Select items in the drawing';

  constructor(paperService: PaperService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer,
              protected store: Store) {
    super(paperService, iconRegistry, sanitizer);
    this.registerIcon();
  }

  protected rubberBand = null;
  protected activeItem = null;
  onMouseDown = (event: paper.ToolEvent) => {
    let action;
    let itemType: string = null;
    if (event.item) {
      itemType = event.item.data.type;
    } else {
      this.rubberBand = this.createRubberBand(event);
      this.paperService.project.activeLayer.addChild(this.rubberBand);
    }

    switch (itemType) {
      case ClassFileEntityType.Class:
      case ClassFileEntityType.Relation:
        action = new SetSelection(this.paperService.fileId, [event.item.data.id]);
        break;
      default:
        action = new SetSelection(this.paperService.fileId, []);
    }

    this.store.dispatch(action);
  };

  onMouseUp = (event: paper.ToolEvent) => {
    this.activeItem = null;
    if (this.rubberBand) {
      this.rubberBand.remove();
      this.rubberBand = null;
    }
  };

  onMouseDrag = (event: paper.ToolEvent) => {
    let selEntity = this.store.selectSnapshot(AppState.selectedEntity) as ClassEntity;
    if (selEntity && selEntity.type == ClassFileEntityType.Class) {
      let loc = new paper.Point(selEntity.metadata.location || this.paperService.project.view.bounds.center).add(event.delta);

      let action = new PatchClassMetaData(this.paperService.fileId, selEntity.id, {
        location: {x: loc.x, y: loc.y},
      });
      this.store.dispatch(action);
    }

    if (this.rubberBand) {
      this.rubberBand.remove();
      this.rubberBand = this.createRubberBand(event);
      this.paperService.project.activeLayer.addChild(this.rubberBand);
    }
  };

  protected createRubberBand(event: paper.ToolEvent) {
    return new paper.Path.Rectangle({
      from: event.downPoint,
      to: event.point,
      strokeColor: 'blue',
      strokeWidth: '2'
    });
  }
}