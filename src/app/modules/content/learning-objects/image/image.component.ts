import {Component, Input} from '@angular/core';
import { LearningObjectComponent } from '../learning-object-component';
import { Image } from './model/image.model';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';

@Component({
  selector: 'cc-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements LearningObjectComponent {

  @Input() learningObject: Image;

  constructor(private dialog: MatDialog) { }

  openImageDialog(): void {
    this.dialog.closeAll();
    this.dialog.open(ImageDialogComponent, {
      data: {
        url: this.learningObject.url
      }
    });
  }

}
