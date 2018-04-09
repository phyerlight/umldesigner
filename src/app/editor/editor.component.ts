import {Component, Input, OnInit} from '@angular/core';
import {ProjectService, File} from "../project.service";
import {PaperCanvasComponent} from "./paperCanvas.component";
import Path = paper.Path;
import Point = paper.Point;
import Color = paper.Color;
import {PaperScope, Project} from "paper";
import {DrawingTool, ToolService} from "./tools.service";
import {CanvasService} from "./canvas.service";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import 'rxjs/add/operator/combineLatest';
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  providers: [ToolService, CanvasService]
})
export class EditorComponent implements OnInit {

  private file$: BehaviorSubject<File>;
  @Input()
  set file(file: File) {
    if (!this.file$) {
      this.file$ = new BehaviorSubject<File>(file);
    } else {
      this.file$.next(file);
    }
  }

  private canvas: PaperCanvasComponent;

  public tools: DrawingTool[];
  private canvasName = 'main';

  constructor(public toolService: ToolService,
              public canvasService: CanvasService) { }

  ngOnInit() {
    this.tools = this.toolService.getTools();
    this.canvasService.getCanvas(this.canvasName).combineLatest(this.file$).subscribe((v: [PaperCanvasComponent, File]) => {
      this.canvas = v[0];

      this.renderDrawing(v[1]);
    });

  }

  get activeTool() {
    return this.canvas.scope.tool;
  }

  activateTool(tool: DrawingTool) {
    tool.activate();
  }

  renderDrawing(file: File) {
    this.canvas.clearCanvas();

    //if we have data
    if (file && file.data && file.data.classes) {
      //draw the classes
      file.data.classes.forEach((clas) => {
        this.canvas.drawClass(clas);
      });
      //if we have relations, draw those too
      if (file.data.relations) {
        file.data.relations.forEach((rel) => {
          this.canvas.drawRelation(rel);
        });
      }
    }

  }
}
