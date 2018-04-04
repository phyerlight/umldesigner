import {Injectable, Injector, Provider, ReflectiveInjector, StaticProvider} from "@angular/core";
import {CanvasService} from "./canvas.service";
import {ConstructorProvider, StaticClassProvider} from "@angular/core/src/di/provider";

export interface DrawingTool extends paper.Tool {
  name: string
  icon: string
  toolTip: string
}

export let tools = Array<DrawingTool>();

@Injectable()
export class ToolService {

  private static registeredToolClasses: Array<any> = [];
  private static registeredProviders: Array<StaticProvider> = [];

  public static addToolProvider(provider: StaticProvider) {
    ToolService.registeredToolClasses.push((<ConstructorProvider>provider).provide);
    ToolService.registeredProviders.push(provider);
  }

  constructor(private injector: Injector) {}

  public getTools(): Array<DrawingTool> {
    let tools: Array<DrawingTool> = [];
    let i = Injector.create(ToolService.registeredProviders, this.injector);

    ToolService.registeredToolClasses.forEach((tc) => {
      tools.push(i.get(tc));
    });

    return tools;
  }
}

@Injectable()
export class NewClassTool extends paper.Tool implements DrawingTool {
  name = 'Class';
  icon = 'add_to_queue';
  toolTip = 'Adds a class to the drawing';

  constructor(private canvasService: CanvasService) {
    super();
  }

  onMouseUp = (event) => {

  }
}
ToolService.addToolProvider({provide: NewClassTool, deps: [CanvasService]});

@Injectable()
export class RelationTool extends paper.Tool implements DrawingTool {
  name = 'Relation';
  icon = 'add_to_queue';
  toolTip = 'Adds a relation between two classes';

  constructor(private canvasService: CanvasService) {
    super();
  }

  onMouseUp = (event) => {

  }
}
ToolService.addToolProvider({provide: RelationTool, deps: [CanvasService]});
