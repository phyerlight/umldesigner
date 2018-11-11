import { Injectable } from '@angular/core';

import { Store } from '@ngxs/store';

import { PointText, Point } from 'paper';
// @ts-ignore
import paper from 'paper';

import { AppState} from '../../app/state/app.state';

import { PaperService } from '../../common/paper/paper.service';
import {File, filterByEntityType} from "../../common/models";
import {DrawingService} from '../../common/services/drawing.service'

import {RelationEntity, RelationType, ClassEntity, ClassFileEntityType} from "../models";

let brk = (fid, cid) => {
  return `${fid},${cid}`;
};

@Injectable()
export class ClassFileDrawingService implements DrawingService {

  // protected tool: paper.Tool;

  protected isEntitySelected: (fId, cId) => boolean;

  constructor(protected paperService: PaperService,
              protected store: Store) {

    store.select(AppState.isEntitySelected).subscribe((fn) => {
      this.isEntitySelected = fn;
    });

    paperService.hasInitialized.then(() => {
      paperService.scope.activate();
    });
  }

  public draw(data: File) {
    this.paperService.project.clear();

    //if we have data
    if (data) {

      //draw the classes
      filterByEntityType(ClassFileEntityType.Class, data).forEach((clas: ClassEntity) => {
        this.drawClass(clas);
      });
      //if we have relations, draw those too
      filterByEntityType(ClassFileEntityType.Relation, data).forEach((rel: RelationEntity) => {
        this.drawRelation(rel);
      });
    }
  }

  public drawClass(clas: ClassEntity) {
    let linePadding = 4;
    let widthPadding = 4;
    let boxWidth = 0;
    let boxHeight = 0;

    let sectionText:PointText[] = [];
    clas.attrs.split('--').forEach((sect, index, array) => {
      let s = new paper.PointText({
        content: sect.trim(),
        fillColor: 'black',
      });

      if (index == 0) {
        boxHeight += linePadding;
      }

      s.pivot = s.bounds.topLeft;
      s.position = new paper.Point(0, boxHeight);
      boxWidth = s.bounds.width > boxWidth ? s.bounds.width : boxWidth;
      boxHeight = boxHeight + s.bounds.height;

      if (index < array.length-1) {
        boxHeight += linePadding;
      }

      sectionText.push(s);
    });

    let name = new paper.PointText({
      content: clas.name,
      fillColor: 'black',
      fontWeight: 'bold',
    });
    boxHeight += name.bounds.height + linePadding*2;
    if (name.bounds.width > boxWidth) {
      name.pivot = name.bounds.bottomLeft;
      name.position = new paper.Point(0,0);
      boxWidth = name.bounds.width;
    } else {
      name.pivot = name.bounds.bottomCenter;
      name.position = new paper.Point(boxWidth/2, -1*widthPadding/2);
    }

    let clasBox = new paper.Path.Rectangle({
      size: [boxWidth+widthPadding*2, boxHeight],
      strokeColor: 'black',
      fillColor: 'white',
      name: 'selector',
    });
    clasBox.pivot = clasBox.bounds.topLeft;
    clasBox.position = new paper.Point(-1*widthPadding, -1*name.bounds.height-widthPadding);

    if (this.isEntitySelected(this.paperService.fileId, clas.id)) {
      clasBox.selected = true;
    }

    let clasObj = new paper.Group({
      pivot: clasBox.bounds.topLeft
    });
    clasObj.addChild(clasBox);
    clasObj.addChild(name);
    clasObj.addChild(new paper.Path.Line({strokeColor: 'black',
      from: [clasBox.bounds.left, name.bounds.bottom+linePadding/2], to: [clasBox.bounds.right, name.bounds.bottom+linePadding/2]}));
    sectionText.forEach((s, index, array)=>{
      clasObj.addChild(s);

      if (index < array.length-1) {
        clasObj.addChild(new paper.Path.Line({strokeColor: 'black',
          from: [clasBox.bounds.left, s.bounds.bottom+linePadding/2], to: [clasBox.bounds.right, s.bounds.bottom+linePadding/2]}));
      }
    });
    clasObj.data = {type: clas.type, id: clas.id};

    let clasLoc = clas.metadata.location;
    if (!clasLoc) {
      clasLoc = this.paperService.project.view.bounds.center;
    }
    clasObj.position = new paper.Point(clasLoc);

    this.paperService.project.activeLayer.addChild(clasObj);
    this.paperService.project.activeLayer.addChild(new paper.Path.Circle({
      center: clasObj.position,
      radius: 3,
      fillColor: 'red'
    }));
  }

  public drawRelation(rel: RelationEntity) {
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
    };

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
        type: ClassFileEntityType.Relation,
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
      case RelationType.Assoc:
        marker.strokeColor = 'black';
        marker.fillColor = 'black';
        break;
      case RelationType.Inherit:
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

    // let assoc = new tools.CompoundPath({
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
