import {Component, OnInit} from '@angular/core';
import { LearningObjectComponent } from '../../learning-object-component';
import { Video } from './video.model';
import {VideoService} from "./video.service";

@Component({
  selector: 'cc-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements LearningObjectComponent, OnInit {

  learningObject: Video;

  constructor(private service: VideoService) { }

  ngOnInit(): void {
    this.service.updateVideoStatus();
  }

  onStateChangeEvent(event:any) {
    if (event.data === 0) {
      this.service.updateVideoStatus("ENDED")
    } else if (event.data === 1) {
      this.service.updateVideoStatus("PLAYING")
    } else if (event.data === 2) {
      this.service.updateVideoStatus("PAUSED")
    }
  }
}
