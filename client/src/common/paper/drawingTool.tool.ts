import {MatIconRegistry} from "@angular/material";
import {DomSanitizer} from "@angular/platform-browser";
import {PaperService} from "./paper.service";

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
      // TODO: figure out a way to get the tools to work properly without forcing the scope assignment here
      // @ts-ignore
      this._scope = paperService.scope;
    });
  }

  registerIcon() {
    this.iconRegistry.addSvgIcon(this.icon,
      this.sanitizer.bypassSecurityTrustResourceUrl(`assets/${this.icon}.svg`));
  }
}
