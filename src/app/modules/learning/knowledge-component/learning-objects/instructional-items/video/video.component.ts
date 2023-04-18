import {Component, OnInit} from '@angular/core';
import { LearningObjectComponent } from '../../learning-object-component';
import { Video } from './video.model';
import {VideoPlaybackService} from "./video-playback.service";

@Component({
  selector: 'cc-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements LearningObjectComponent, OnInit {

  learningObject: Video;

  constructor(private videoPlaybackService: VideoPlaybackService) { }

  ngOnInit(): void {
    this.videoPlaybackService.start();
  }

  onStateChangeEvent(event:any) {
    if (event.data === 0) {
      this.videoPlaybackService.updatePlaybackStatus("ENDED")
    } else if (event.data === 1) {
      this.videoPlaybackService.updatePlaybackStatus("PLAYING")
    } else if (event.data === 2) {
      this.videoPlaybackService.updatePlaybackStatus("PAUSED")
    }
  }
}
