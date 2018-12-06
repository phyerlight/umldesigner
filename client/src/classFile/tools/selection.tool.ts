import {Injectable} from "@angular/core";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {DrawingTool} from "../../common/paper/drawingTool.tool";
import {PaperService} from "../../common/paper/paper.service";

// import paper from 'paper';
import {Store} from "@ngxs/store";
import {ClassEntity, ClassFileEntityType} from "../models";
import {AddToSelection, RemoveFromSelection, SetSelection} from "../../app/state/app.actions";
import {PatchClassMetaData} from "../state/classFile.actions";
import {AppState} from "../../app/state/app.state";
import {FileEntity, FileEntityWithMeta, isEntityWithMeta} from "../../common/models";

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

  /*
  On mouse down:
   If we haven't clicked on anything,
    or there is no selection,
    or what we've clicked isn't part of the selection then
     start the rubber band

  On mouse drag:
   If the rubber band is active then drag it around
   Or if there is a selection then move the selection

  On mouse up:
   If there is a rubber band, find all items caught in it
     If the shift key is pressed, add to selection
     If the control key is pressed, remove from selection
     If no key is pressed, set the selection
   If there is an item that's been clicked on
     If the shift key is pressed, add to selection
     If the control key is pressed, remove from selection
     If no key is pressed, set the selection
   */
  protected rubberBand = null;
  protected dragged = false;
  onMouseUp = (event: paper.ToolEvent) => {
    if (this.rubberBand) { // If there is a rubber band
      let selection = [];
      for (let item of this.paperService.project.activeLayer.children) { // find all items caught in rubber band
        if (item.data.id && (item.isInside(this.rubberBand.bounds) || item.intersects(this.rubberBand))) {
          selection.push(item.data.id);
        }
      }
      //if there are some selected items select type of action based on modifiers and perform it
      let action: typeof SetSelection | typeof AddToSelection | typeof RemoveFromSelection = SetSelection;
      if (event.modifiers.shift) { //add to selection
        action = AddToSelection;
      } else if (event.modifiers.control) { // remove from selection
        action = RemoveFromSelection;
      }
      this.store.dispatch(new action(this.paperService.fileId, selection));
      //remove the rubber band and clean up
      this.rubberBand.remove();
      this.rubberBand = null;
    } else if (this.dragged) { // if there is no rubber band, bt it has been dragged, it means that stuff has been moved so leave the selection state as it is
      //do nothing else
    } else if (event.item && event.item.data) { // if no drag occurred but we're over an item, select an action and perform it
      let action: typeof SetSelection | typeof AddToSelection | typeof RemoveFromSelection = SetSelection;
      if (event.modifiers.shift) { //add to selection
        action = AddToSelection;
      } else if (event.modifiers.control) { // remove from selection
        action = RemoveFromSelection;
      }
      this.store.dispatch(new action(this.paperService.fileId, [event.item.data.id]));
    } else { // otherwise, there was a click on nothing, so set the selection to nothing.
      this.store.dispatch(new SetSelection(this.paperService.fileId, []));
    }
    this.dragged = false;
  };

  onMouseDrag = (event: paper.ToolEvent) => {
    if (!this.dragged) { //if this is the first drag event since the last mouse down, determine if we're starting a rubber band or not
      this.dragged = true;
      let selEntities = this.store.selectSnapshot(AppState.activeSelection);
      if (!event.item || (event.item && !event.item.data) ||
        selEntities.length < 1 ||
        !event.item.selected) {
        this.rubberBand = this.createRubberBand(event);
        this.paperService.project.activeLayer.addChild(this.rubberBand);
      }
    }
    if (this.rubberBand) { // if we have a rubber band, work with it
      this.rubberBand.remove();
      this.rubberBand = this.createRubberBand(event);
      this.paperService.project.activeLayer.addChild(this.rubberBand);
    } else { // otherwise move the selected items
      let selEntities = this.store.selectSnapshot(AppState.selectedEntities) as Array<FileEntity | FileEntityWithMeta>;
      for (let selEntity of selEntities) {
        if (isEntityWithMeta(selEntity)) {

          let loc = new paper.Point(selEntity.metadata.location).add(event.delta);
          let action = new PatchClassMetaData(this.paperService.fileId, selEntity.id, {
            location: {x: loc.x, y: loc.y},
          });
          this.store.dispatch(action);
        }
      }
    }
  };

  protected createRubberBand(event: paper.ToolEvent) {
    return new paper.Path.Rectangle({
      from: event.downPoint,
      to: event.point,
      strokeColor: 'blue',
      strokeWidth: '2',
      name: 'rubberband'
    });
  }
}