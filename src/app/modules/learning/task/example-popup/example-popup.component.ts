import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'cc-example-popup',
  templateUrl: './example-popup.component.html',
  styleUrls: ['./example-popup.component.scss']
})
export class ExamplePopupComponent {

  selectedStep: any;
  selectedExample: any;
  videoUrl: string;

  constructor(public dialogRef: MatDialogRef<ExamplePopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.selectedStep = data;
    this.selectedExample = this.selectedStep.examples[0];
    this.videoUrl = this.selectedExample.url.split('/').pop().slice(-11);
  }

  getNextExample() {
    let index = this.selectedStep.examples.indexOf(this.selectedExample);
    if (index != this.selectedStep.examples.length - 1) {
      this.selectedExample = this.selectedStep.examples[index + 1];
    } else {
      this.selectedExample = this.selectedStep.examples[index - 1];
    }
    this.videoUrl = this.selectedExample.url.split('/').pop().slice(-11);
  }
}
