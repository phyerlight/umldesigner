import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {ClassEntity} from "../../models/index";

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
      let cls: ClassEntity = this.data.cls;
      this.name = cls.name;
      this.attributes = cls.attrs;
    }
  }

  save() {
    let cls = {
      ...this.data.cls,
      name: this.name,
      attrs: this.attributes
    };
    this.dialogRef.close(cls);
  }
}
