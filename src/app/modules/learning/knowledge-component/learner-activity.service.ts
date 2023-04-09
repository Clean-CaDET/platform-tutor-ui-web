import {Injectable, OnDestroy} from '@angular/core';
import {fromEvent, interval, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {VideoService} from "./learning-objects/instructional-items/video/video.service";


@Injectable()
export class LearnerActivityService implements OnDestroy {
  private events: string[] = ['keydown', 'click', 'wheel', 'mousemove'];
  private sessionPaused = false;
  private checkLearnerActivitySubscription: Subscription;
  private eventsSubscriptions: Subscription[] = [];
  private videoSubscription: Subscription
  private videoStatus: string = null;
  private lastActive: Date = new Date();

  constructor(private http: HttpClient, private videoService: VideoService) {
    this.setUp()
    this.videoSubscription =  this.videoService.videoStatus$.subscribe(videoStatus => {
      this.videoStatus = videoStatus;
    })
  }

  ngOnDestroy(): void {
    this.checkLearnerActivitySubscription.unsubscribe();
    this.eventsSubscriptions.forEach(sub => sub.unsubscribe())
    this.videoSubscription.unsubscribe()
  }

  public checkUserActivity(kcId: number) {
    this.checkLearnerActivitySubscription = interval(1000)
      .subscribe(() => {
        let inactiveInMinutes = Math.floor(new Date().getTime() - this.lastActive.getTime())/60000

        if (!this.sessionPaused && this.videoStatus !== "PLAYING" && inactiveInMinutes > 3) {
          this.pauseSession(kcId).subscribe({
            next: () => {this.sessionPaused = true;},
            error: () => {}
          })
        } else if ((inactiveInMinutes < 0.1  && this.sessionPaused) || (this.videoStatus === "PLAYING" &&
        this.sessionPaused)) {
          this.continueSession(kcId).subscribe({
            next: () => {this.sessionPaused = false;},
            error: () => {}
          })
        } else if (this.videoStatus == "PLAYING" && !this.sessionPaused) {
          this.recordLastActiveDate();
        }
      });
  }

  private pauseSession(kcId: number) {
    return this.http.post<unknown>(environment.apiHost + 'learning/session/' + kcId + '/pause', null);
  }

  private continueSession(kcId: number) {
    return this.http.post<unknown>(environment.apiHost + 'learning/session/' + kcId + '/continue', null);
  }

  private setUp() {
    this.events.forEach(event =>
      this.eventsSubscriptions.push(fromEvent(document, event).subscribe(_ => this.recordLastActiveDate()))
    );
  }

  private recordLastActiveDate() {
    this.lastActive = new Date();
  }
}
