import {Injectable} from "@angular/core";
import {PaperCanvasComponent} from "./paperCanvas.component";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import { map, filter } from "rxjs/operators";

@Injectable()
export class CanvasService {

  public canvases$: Observable<Map<string,PaperCanvasComponent>>;
  private _canvases = new BehaviorSubject(new Map());

  constructor() {
    this.canvases$ = this._canvases.asObservable();
  }

  public registerCanvas(canvas: PaperCanvasComponent, name=null) {
    let cs = this._canvases.getValue();
    if (name == null) {
      name = 'canvas'+(cs.size+1);
    }
    cs.set(name, canvas);
    this._canvases.next(cs);
  }

  public getActiveCanvas(): Observable<PaperCanvasComponent> {
    return this.canvases$.pipe(
      map((cs: Map<string, PaperCanvasComponent>) => {
        let it = cs.values(); // canvas iterator
        let iti = it.next(); // iterator item
        while (!iti.done) {
          let c = iti.value;
          if (c.project == window['paper'].project) {
            return c;
          }
          iti = it.next();
        }
      }),
      filter(c => c != null && c != undefined)
    );
  }

  public getCanvas(name): Observable<PaperCanvasComponent> {
    return this.canvases$.pipe(
      map((cs: Map<string, PaperCanvasComponent>) => {
        if (cs.has(name)) {
          return cs.get(name);
        }
      }),
      filter(c => {
        return c != null
      })
    );
  }

}
