import {Component, Input, OnInit} from '@angular/core';
import { LearningObjectComponent } from '../learning-object-component';
import { Video } from './model/video.model';

@Component({
  selector: 'cc-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit, LearningObjectComponent {

  @Input() learningObject: Video;

  constructor() { }

  ngOnInit(): void {
  }

}
