import {Injectable, Injector, StaticProvider} from "@angular/core";

import {NewClassTool} from "../../../classFile/tools/newClass.tool";
import {AssocRelationTool} from "../../../classFile/tools/assocRelation.tool";
import {InheritRelationTool} from "../../../classFile/tools/inheritRelation.tool";
import {SelectionTool} from "../../../classFile/tools/selection.tool";
import {DrawingTool} from "../../../common/paper/drawingTool.tool";

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
