import { Component } from '@angular/core';
import { Image } from './image.model';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { LearningObjectComponent } from '../../learning-object-component';

@Component({
  selector: 'cc-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements LearningObjectComponent {

  learningObject: Image;

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
