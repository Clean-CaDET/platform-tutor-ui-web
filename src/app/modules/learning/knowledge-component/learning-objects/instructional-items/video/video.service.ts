import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  videoStatus$ = new BehaviorSubject(null);

  constructor() { }

  public updateVideoStatus(state?: string) {
    this.videoStatus$.next(state || null)
  }
}
