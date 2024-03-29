import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'cc-example-popup',
  templateUrl: './example-popup.component.html',
  styleUrls: ['./example-popup.component.scss']
})
export class ExamplePopupComponent {

  selectedStep: any;
  selectedExample: any;
  videoUrl: SafeResourceUrl;

  constructor(public dialogRef: MatDialogRef<ExamplePopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer) {
    this.selectedStep = data;
    this.selectedExample = this.selectedStep.examples[0];
    this.videoUrl = this.getSafeUrl(this.selectedExample.url);
  }

  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getNextExample() {
    let index = this.selectedStep.examples.indexOf(this.selectedExample);
    if (index != this.selectedStep.examples.length - 1) {
      this.selectedExample = this.selectedStep.examples[index + 1];
    } else {
      this.selectedExample = this.selectedStep.examples[index - 1];
    }
    this.videoUrl = this.getSafeUrl(this.selectedExample.url);
  }
}
