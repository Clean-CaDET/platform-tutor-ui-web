import {Component, OnInit, Inject} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EmotionsService} from './emotions.service';
import {Router} from '@angular/router';

@Component({
  selector: 'cc-emotions',
  templateUrl: './emotions.component.html',
  styleUrls: ['./emotions.component.scss']
})
export class EmotionsComponent implements OnInit {
  emotionsForm = new FormGroup({
    emotionsFeedback: new FormControl('', [
      Validators.required,
      this.emotionsValidator()])
  });

  constructor(private dialogRef: MatDialogRef<EmotionsComponent>,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) private data,
              private emotionsService: EmotionsService) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.emotionsService.submitEmotionsFeedback(this.data.kcId, this.emotionsForm.value.emotionsFeedback);
    this.router.navigate(['/unit', this.data.unitId]);
    this.dialogRef.close();
  }

  emotionsValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const valid = control.value.length > 10;
      return valid ? null : {shortText: {value: control.value}};
    };
  }
}
