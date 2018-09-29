import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core';
import {CanvasService} from "./canvas.service";
import {PaperCanvasComponent} from "./paperCanvas.component";
import {ClassFormComponent} from "./forms/class-form/class-form.component";
import {Class, File, FileData, Relation} from "../file.service";
import PointText = paper.PointText;
import Group = paper.Group;
import Point = paper.Point;
import Path = paper.Path;

@Component({
  // moduleId: module.id,
  styles: ['canvas {width: 100%; height: 100%}'],
  selector: 'design-canvas',
  template: '<canvas #canvasElement resize></canvas>',
  // providers: []
})
export class DesignCanvasComponent extends PaperCanvasComponent implements OnChanges {
  @Output() changed = new EventEmitter<File>();

  ngOnChanges(changes) {
    if (changes.data && this.project) {
      this.renderDrawing(this.data);
    }
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.renderDrawing(this.data);
  }

  updateData(newData) {
    this.changed.emit(newData);
  }

  public renderDrawing(data: FileData) {
    this.clearCanvas();

    //if we have data
    if (data && data.classes) {
      //draw the classes
      data.classes.forEach((clas) => {
        this.drawClass(clas);
      });
      //if we have relations, draw those too
      if (data.relations) {
        data.relations.forEach((rel) => {
          this.drawRelation(rel);
        });
      }
    }
  }

  public drawClass(clas: Class) {
    let linePadding = 4;
    let widthPadding = 4;
    let boxWidth = 0;
    let boxHeight = 0;

    let sectionText:PointText[] = [];
    clas.attrs.join("\n").split('--').forEach((sect, index, array) => {
      let s = new PointText({
        content: sect.trim(),
        fillColor: 'black',
        project: this.project
      });

      if (index == 0) {
        boxHeight += linePadding;
      }

      s.pivot = s.bounds.topLeft;
      s.position = new Point(0, boxHeight);
      boxWidth = s.bounds.width > boxWidth ? s.bounds.width : boxWidth;
      boxHeight = boxHeight + s.bounds.height;

      if (index < array.length-1) {
        boxHeight += linePadding;
      }

      sectionText.push(s);
    });

    let name = new PointText({
      content: clas.name,
      fillColor: 'black',
      fontWeight: 'bold',
      project: this.project
    });
    boxHeight += name.bounds.height + linePadding*2;
    if (name.bounds.width > boxWidth) {
      name.pivot = name.bounds.bottomLeft;
      name.position = new Point(0,0);
      boxWidth = name.bounds.width;
    } else {
      name.pivot = name.bounds.bottomCenter;
      name.position = new Point(boxWidth/2, -1*widthPadding/2);
    }

    let clasBox = new Path.Rectangle({
      size: [boxWidth+widthPadding*2, boxHeight],
      strokeColor: 'black',
      name: 'selector',
      project: this.project
    });
    clasBox.pivot = clasBox.bounds.topLeft;
    clasBox.position = new Point(-1*widthPadding, -1*name.bounds.height-widthPadding);

    let clasObj = new Group();

    clasObj.addChild(name);
    clasObj.addChild(new Path.Line({strokeColor: 'black',
      from: [clasBox.bounds.left, name.bounds.bottom+linePadding/2], to: [clasBox.bounds.right, name.bounds.bottom+linePadding/2]}));
    sectionText.forEach((s, index, array)=>{
      clasObj.addChild(s);

      if (index < array.length-1) {
        clasObj.addChild(new Path.Line({strokeColor: 'black',
          from: [clasBox.bounds.left, s.bounds.bottom+linePadding/2], to: [clasBox.bounds.right, s.bounds.bottom+linePadding/2]}));
      }
    });
    clasObj.addChild(clasBox);
    clasObj.data = {type: 'class'};

    clasObj.position = new Point(clas.position.x, clas.position.y);

    this.project.activeLayer.addChild(clasObj);
  }

  public drawRelation(rel: Relation) {
    let fromItem = this.paperService.project.getItem({
      data: {id: rel.fromId}
    });
    let toItem = this.paperService.project.getItem({
      data: {id: rel.toId}
    });

    if (!fromItem || !toItem) return;

    let fromBounds = fromItem.bounds;
    let toBounds = toItem.bounds;
    let cLine = new paper.Path.Line(fromBounds.center, toBounds.center);

    enum ORIENT {
      HOR = 'HOR',
      VER = 'VER'
    }

    enum DIR {
      UP = 'HOR',
      DOWN = 'VER',
      LEFT = 'LEFT',
      RIGHT = 'RIGHT'
    }

    let detSideCenter = (line, bound) => {
      let result = null;
      let pt = new paper.Path.Rectangle(bound).getIntersections(line)[0].point;
      [
        [pt.x, bound.left, bound.leftCenter, ORIENT.HOR],
        [pt.x, bound.right, bound.rightCenter, ORIENT.HOR],
        [pt.y, bound.top, bound.topCenter, ORIENT.VER],
        [pt.y, bound.bottom, bound.bottomCenter, ORIENT.VER]
      ].forEach(([val, side, pt, dir]) => {
        if (val == side)
          result = [pt as Point, dir];
      });
      return result;
    }

    let fromPoint: Point, fromDir: ORIENT;
    let toPoint: Point, toDir: ORIENT;
    let lineDir: DIR;
    try {
      [fromPoint, fromDir] = detSideCenter(cLine, fromBounds);
      [toPoint, toDir] = detSideCenter(cLine, toBounds);
    } catch (err) {
      return;
    }

    if (toDir == ORIENT.HOR) {
      if (toPoint.x > fromPoint.x) {
        lineDir = DIR.RIGHT;
      } else {
        lineDir = DIR.LEFT;
      }
    } else {
      if (toPoint.y > fromPoint.y) {
        lineDir = DIR.DOWN;
      } else {
        lineDir = DIR.UP;
      }

    }

    let arrowRad = 6;
    let path = new paper.Path([fromPoint, toPoint]);
    let marker = new paper.Path.RegularPolygon(toPoint, 3, arrowRad);

    let assoc = new paper.Group({
      children: [path, marker],
      data: {
        type: FileEntityType.Relation,
        id: rel.id
      }
    });

    path.strokeColor = 'black';
    if (fromDir == toDir) { //Make a zig zag
      if (fromDir == ORIENT.HOR) {
        let midx = (fromPoint.x + toPoint.x) / 2;
        path.insertSegments(1, [[midx, fromPoint.y], [midx, toPoint.y]]);
      } else {
        let midy = (fromPoint.y + toPoint.y) / 2;
        path.insertSegments(1, [[fromPoint.x, midy], [toPoint.x, midy]]);
      }
    } else { // Make a right angle
      if (fromDir == ORIENT.HOR) {
        path.insert(1, [toPoint.x, fromPoint.y]);
      } else {
        path.insert(1, [fromPoint.x, toPoint.y]);
      }
    }

    switch (rel.reltype) {
      case Relation.Assoc:
        marker.strokeColor = 'black';
        marker.fillColor = 'black';
        break;
      case Relation.Inherit:
        marker.strokeColor = 'black';
        marker.fillColor = 'white';
        break;
    }

    if (toDir == ORIENT.HOR) {
      if (lineDir == DIR.LEFT) {
        marker.rotate(30);
        marker.translate([arrowRad, 0]);
      } else {
        marker.rotate(-30);
        marker.translate([-arrowRad, 0]);
      }
    } else {
      if (lineDir == DIR.DOWN) {
        marker.rotate(180);
        marker.translate([0, -arrowRad]);
      } else {
        marker.translate([0, arrowRad]);
      }
    }

    if (this.isEntitySelected(this.paperService.fileId, rel.id)) {
      assoc.selected = true;
    }

    this.paperService.project.activeLayer.addChild(assoc);

    // let assoc = new paper.CompoundPath({
    //   children: [marker, path],
    //   data: {
    //     type: FileEntityType.Relation,
    //     id: rel.id
    //   },
    //   strokeColor: 'black',
    //   fillColor: 'black',
    //   closed: false
    // });
    // this.paperService.project.activeLayer.addChild(assoc);

  }

}
