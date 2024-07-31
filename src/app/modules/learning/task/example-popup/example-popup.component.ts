import { Component, EventEmitter, Inject } from '@angular/core';
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
  videoEventEmitter: EventEmitter<any> = new EventEmitter();

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

  public onVideoStatusChanged(event: any): void {
    if (event.data === 0) {
      this.videoEventEmitter.emit(
        {
          videoStatus: 0,
          videoUrl: this.videoUrl
        }
      )
    } else if (event.data === 1) {
      this.videoEventEmitter.emit(
        {
          videoStatus: 1,
          videoUrl: this.videoUrl
        }
      )
    } else if (event.data === 2) {
      this.videoEventEmitter.emit(
        {
          videoStatus: 2,
          videoUrl: this.videoUrl
        }
      )
    } 
  }
}
