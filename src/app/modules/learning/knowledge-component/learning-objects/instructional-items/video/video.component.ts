import { Component } from '@angular/core';
import { LearningObjectComponent } from '../../learning-object-component';
import { Video } from './video.model';

@Component({
  selector: 'cc-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements LearningObjectComponent {

  learningObject: Video;

  constructor() { }

}
