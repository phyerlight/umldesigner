import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Class} from "../../../file.service";
import {List} from "immutable";

@Component({
  selector: 'app-class-form',
  // template: ``,
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ClassFormComponent implements OnInit {

  protected name: string;
  protected attributes: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ClassFormComponent>
  ) { }

  ngOnInit() {
    if (this.data.cls) {
      let cls: Class = this.data.cls;
      this.name = cls.name;
      this.attributes = cls.attrs.join('\n');
    }
  }

  save() {
    let cls = (this.data.cls as Class).with({
      name: this.name,
      attrs: List<string>(this.attributes.split('\n'))
    });
    this.dialogRef.close(cls);
  }
}
