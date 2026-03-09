import { Component, ChangeDetectionStrategy, input, inject, OnInit } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { VideoLearningObject, getVideoId } from '../../../model/learning-object.model';
import { VideoPlaybackService } from '../../video-playback.service';

@Component({
  selector: 'cc-video-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [YouTubePlayer],
  template: `
    <div class="video-wrapper">
      <youtube-player [videoId]="videoId()" (stateChange)="onStateChange($event)" />
    </div>
    @if (item().caption) {
      <p class="caption">{{ item().caption }}</p>
    }
  `,
  styles: `
    .video-wrapper { display: flex; justify-content: center; }
    .caption { text-align: center; font-style: italic; margin-top: 8px; }
  `,
})
export class VideoItemComponent implements OnInit {
  private readonly videoPlayback = inject(VideoPlaybackService);
  readonly item = input.required<VideoLearningObject>();

  videoId = () => getVideoId(this.item().url);

  ngOnInit(): void {
    this.videoPlayback.start();
  }

  onStateChange(event: YT.OnStateChangeEvent): void {
    this.videoPlayback.updatePlaybackStatus(String(event.data));
  }
}
