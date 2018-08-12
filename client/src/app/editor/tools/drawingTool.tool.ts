import {CanvasService} from "../canvas.service";
import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {PaperCanvasComponent} from "../paperCanvas.component";

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
