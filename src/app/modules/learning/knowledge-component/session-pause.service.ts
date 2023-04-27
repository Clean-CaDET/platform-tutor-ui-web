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
  private kcId: number;
  private lastActive: Date;

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
    localStorage.removeItem("IsPaused" + this.kcId);
    localStorage.removeItem("LastActive" + this.kcId);
  }

  public start(kcId: number) {
    this.kcId = kcId;
    this.activityCheckIntervalSubscription = interval(1000)
      .subscribe(() => {
        this.checkLearnerActivity(kcId);
      });
  }

  private checkLearnerActivity(kcId: number) {

    if (!localStorage.getItem("IsPaused" + this.kcId)) {
      localStorage.setItem("IsPaused" + this.kcId, String(false))
    }
    if (!localStorage.getItem("LastActive" + this.kcId)) {
      this.lastActive = new Date()
      localStorage.setItem("LastActive" + this.kcId, this.lastActive.toString())
    }

    let inactiveInMinutes = Math.floor(new Date().getTime() - new Date(localStorage.getItem("LastActive" + this.kcId)).getTime()) / 60000
    if ((localStorage.getItem("IsPaused" + this.kcId) === "false") && this.videoPlaybackStatus !== "PLAYING" && inactiveInMinutes > 3) {
      this.pauseSession(kcId).subscribe({
        next: () => {
          localStorage.setItem("IsPaused" + this.kcId, String(true))
        }
      })
    } else if (localStorage.getItem("IsPaused" + this.kcId) === "true" && inactiveInMinutes < 0.5) {
      this.continueSession(kcId).subscribe({
        next: () => {
          localStorage.setItem("IsPaused" + this.kcId, String(false))
        }
      })
    }
    if (this.videoPlaybackStatus === "PLAYING" && localStorage.getItem("IsPaused" + this.kcId) === "false") {
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
    localStorage.setItem("LastActive" + this.kcId, this.lastActive.toString())
  }
}
