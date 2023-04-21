import {Injectable, OnDestroy} from '@angular/core';
import {fromEvent, interval, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {VideoPlaybackService} from "./learning-objects/instructional-items/video/video-playback.service";


@Injectable()
export class SessionPauseService implements OnDestroy {
  private activityCheckIntervalSubscription: Subscription;
  private eventsSubscriptions: Subscription[] = [];
  private videoSubscription: Subscription;
  private videoPlaybackStatus: string = null;
  private lastActive: Date = new Date();
  private sessionPaused = false;

  constructor(private http: HttpClient, private videoService: VideoPlaybackService) {
    const events: string[] = ['keydown', 'click', 'wheel', 'mousemove'];
    events.forEach(event =>
      this.eventsSubscriptions.push(fromEvent(document, event).subscribe(_ => this.recordLastActiveDate()))
    );
    this.videoSubscription =  this.videoService.playbackStatus$.subscribe(videoStatus => {
      this.videoPlaybackStatus = videoStatus;
    })
  }

  ngOnDestroy(): void {
    this.activityCheckIntervalSubscription.unsubscribe();
    this.eventsSubscriptions.forEach(sub => sub.unsubscribe());
    this.videoSubscription.unsubscribe();
  }

  public start(kcId: number) {
    this.activityCheckIntervalSubscription = interval(1000)
      .subscribe(() => {
        this.checkLearnerActivity(kcId);
      });
  }

  private checkLearnerActivity(kcId: number) {
    let inactiveInMinutes = Math.floor(new Date().getTime() - this.lastActive.getTime()) / 60000
    if (!this.sessionPaused && this.videoPlaybackStatus !== "PLAYING" && inactiveInMinutes > 3) {
      this.pauseSession(kcId).subscribe({
        next: () => {
          this.sessionPaused = true;
        }
      })
    } else if (this.sessionPaused && inactiveInMinutes < 0.1) {
      this.continueSession(kcId).subscribe({
        next: () => {
          this.sessionPaused = false;
        }
      })
    }
    if (this.videoPlaybackStatus === "PLAYING" && !this.sessionPaused) {
      this.recordLastActiveDate();
    }
  }

  private pauseSession(kcId: number) {
    return this.http.post<unknown>(environment.apiHost + 'learning/session/' + kcId + '/pause', null);
  }

  private continueSession(kcId: number) {
    return this.http.post<unknown>(environment.apiHost + 'learning/session/' + kcId + '/continue', null);
  }

  private recordLastActiveDate() {
    this.lastActive = new Date();
  }
}
