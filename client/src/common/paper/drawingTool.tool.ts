import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {PaperService} from "../../app/paper/paper.service";

export abstract class DrawingTool extends paper.Tool {
  name: string = null;
  icon: string = null;
  toolTip: string = null;

  constructor(protected paperService: PaperService,
              protected iconRegistry: MatIconRegistry,
              protected sanitizer: DomSanitizer) {
    super();
    paperService.hasInitialized.then(() => {
      paperService.scope.tools.push(this);
    });
  }

  registerIcon() {
    this.iconRegistry.addSvgIcon(this.icon,
      this.sanitizer.bypassSecurityTrustResourceUrl(`assets/${this.icon}.svg`));
  }
}
