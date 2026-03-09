import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VideoPlaybackService {
  readonly playbackStatus$ = new BehaviorSubject<string | null>(null);

  updatePlaybackStatus(state: string): void {
    this.playbackStatus$.next(state);
  }

  start(): void {
    this.playbackStatus$.next(null);
  }
}
