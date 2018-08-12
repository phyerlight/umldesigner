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

  }

}
