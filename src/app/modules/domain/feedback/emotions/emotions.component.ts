import {Component, OnInit, Inject} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'cc-emotions',
  templateUrl: './emotions.component.html',
  styleUrls: ['./emotions.component.css']
})
export class EmotionsComponent implements OnInit {
  emotionsForm = new FormGroup({
    emotionsFeedback: new FormControl('', [
      Validators.required,
      this.emotionsValidator()])
  });

  constructor(private dialogRef: MatDialogRef<EmotionsComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.emotionsForm.valid) {
      this.dialogRef.close();
      alert('Ok');
    } else {
      alert('Fail');
    }
  }

  emotionsValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = control.value.length > 10;
      return valid ? null : {shortText: {value: control.value}};
    };
  }
}
