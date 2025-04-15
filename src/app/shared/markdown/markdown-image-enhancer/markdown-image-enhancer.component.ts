import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'cc-markdown-image-enhancer',
  templateUrl: './markdown-image-enhancer.component.html',
  styleUrl: './markdown-image-enhancer.component.scss'
})
export class MarkdownImageEnhancerComponent {
  imageSrc: string;
  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.imageSrc = data.src;
  }
}
