import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-new-dialog',
  templateUrl: './new-dialog.component.html',
  styleUrls: ['./new-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewDialogComponent {

  protected disallowedCharacters = /^[^&'"\\/()[\]?{}]+$/;

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(this.disallowedCharacters)
    ])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewDialogComponent>) { }

  get placeholder() {
    let word = this.data.type;
    return word[0].toUpperCase() + word.substr(1).toLowerCase() + " Name";
  }

  get name() { return this.form.get('name'); }

  close(name: string) {
    if (name == null) {
      this.dialogRef.close(null);
    } else if (this.form.valid) {
      this.dialogRef.close(name);
    }
  }
}
