import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VideoPlaybackService {
  playbackStatus$ = new BehaviorSubject(null);

  constructor() { }

  public updatePlaybackStatus(state: string) {
    this.playbackStatus$.next(state)
  }

  public start() {
    this.playbackStatus$.next(null)
  }
}
