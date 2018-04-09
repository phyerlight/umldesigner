import {Injectable, Injector, StaticProvider} from "@angular/core";
import {ConstructorProvider} from "@angular/core/src/di/provider";
import {MatIcon, MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {CanvasService} from "./canvas.service";
import {PaperCanvasComponent} from "./paperCanvas.component";

export const DRAWING_TOOL_DEPS = [CanvasService, MatIconRegistry, DomSanitizer];

export abstract class DrawingTool extends paper.Tool {
  name: string = null;
  icon: string = null;
  toolTip: string = null;

  constructor(protected canvasService: CanvasService,
              protected iconRegistry: MatIconRegistry,
              protected sanitizer: DomSanitizer) {
    super();
    canvasService.getActiveCanvas().subscribe((canvas: PaperCanvasComponent) => {
      canvas.scope.tools.push(this);
    });
  }

  registerIcon() {
    this.iconRegistry.addSvgIcon(this.icon,
      this.sanitizer.bypassSecurityTrustResourceUrl(`assets/${this.icon}.svg`));
  }
}

export function loadTools() {
  import('./tools/selection.tool');
  import('./tools/newClass.tool');
  import('./tools/inheritRelation.tool');
  import('./tools/assocRelation.tool');
}

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

loadTools();
