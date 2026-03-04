import { Injectable, inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription, interval, fromEvent, merge, throttleTime } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { VideoPlaybackService } from './video-playback.service';

const INACTIVITY_THRESHOLD_MS = 3 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class SessionPauseService implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly videoPlayback = inject(VideoPlaybackService);

  private kcId = 0;
  private intervalSub?: Subscription;
  private activitySub?: Subscription;
  private videoSub?: Subscription;
  private isPaused = false;
  private isVideoPlaying = false;

  start(kcId: number): void {
    this.stop();
    this.kcId = kcId;
    this.isPaused = this.getStoredPauseState();
    this.recordLastActiveDate();

    this.videoSub = this.videoPlayback.playbackStatus$.subscribe(status => {
      this.isVideoPlaying = status === '1';
    });

    this.activitySub = merge(
      fromEvent(document, 'keydown'),
      fromEvent(document, 'click'),
      fromEvent(document, 'wheel'),
      fromEvent(document, 'mousemove'),
    ).pipe(throttleTime(2000)).subscribe(() => {
      this.recordLastActiveDate();
      if (this.isPaused) {
        this.continueSession();
      }
    });

    this.intervalSub = interval(1000).subscribe(() => this.checkLearnerActivity());
  }

  stop(): void {
    this.intervalSub?.unsubscribe();
    this.activitySub?.unsubscribe();
    this.videoSub?.unsubscribe();
    this.clearStorage();
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private checkLearnerActivity(): void {
    if (this.isPaused || this.isVideoPlaying) return;
    const lastActive = localStorage.getItem(`LastActive${this.kcId}`);
    if (!lastActive) return;
    const elapsed = Date.now() - new Date(lastActive).getTime();
    if (elapsed > INACTIVITY_THRESHOLD_MS) {
      this.pauseSession();
    }
  }

  private pauseSession(): void {
    this.isPaused = true;
    localStorage.setItem(`IsPaused${this.kcId}`, 'true');
    this.http.post(`${environment.apiHost}learning/session/${this.kcId}/pause`, null).subscribe();
  }

  private continueSession(): void {
    this.isPaused = false;
    localStorage.removeItem(`IsPaused${this.kcId}`);
    this.recordLastActiveDate();
    this.http.post(`${environment.apiHost}learning/session/${this.kcId}/continue`, null).subscribe();
  }

  private recordLastActiveDate(): void {
    localStorage.setItem(`LastActive${this.kcId}`, new Date().toISOString());
  }

  private getStoredPauseState(): boolean {
    return localStorage.getItem(`IsPaused${this.kcId}`) === 'true';
  }

  private clearStorage(): void {
    if (!this.kcId) return;
    localStorage.removeItem(`IsPaused${this.kcId}`);
    localStorage.removeItem(`LastActive${this.kcId}`);
  }
}
