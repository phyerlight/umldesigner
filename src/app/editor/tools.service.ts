import {Injectable} from "@angular/core";

export class DrawingTool extends paper.Tool {
  constructor(
    public name: string,
    public icon: string,
    public toolTip: string,
  ) {
    super();
  }
}

export let tools = Array<DrawingTool>();

@Injectable()
export class ToolService {

  public static registeredTools = new Array<DrawingTool>();

  constructor() {

  }

  public static addTool(tool: DrawingTool) {
    ToolService.registeredTools.push(tool);
  }
}

let newClassTool = new DrawingTool('Class', 'add_to_queue', 'Adds a class to the drawing');
ToolService.addTool(newClassTool);
newClassTool.onMouseUp = (event) => {

};


