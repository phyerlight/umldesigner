import {Injectable, Injector, StaticProvider} from "@angular/core";

import {NewClassTool} from "./tools/newClass.tool";
import {AssocRelationTool} from "./tools/assocRelation.tool";
import {InheritRelationTool} from "./tools/inheritRelation.tool";
import {SelectionTool} from "./tools/selection.tool";
import {DrawingTool} from "./tools/drawingTool.tool";

export function loadTools() {
  ToolService.registerTool(SelectionTool);
  ToolService.registerTool(NewClassTool);
  ToolService.registerTool(AssocRelationTool);
  ToolService.registerTool(InheritRelationTool);
}

@Injectable()
export class ToolService {

  private static registeredToolClasses: Array<any> = [];

  public static registerTool(tool: any) {
    ToolService.registeredToolClasses.push(tool);
  }

  constructor(private injector: Injector) {}

  public getTools(): Array<DrawingTool> {
    let tools: Array<DrawingTool> = [];

    ToolService.registeredToolClasses.forEach((tc) => {
      tools.push(this.injector.get(tc));
    });

    return tools;
  }
}

loadTools();
