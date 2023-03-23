import {Injectable, OnDestroy} from '@angular/core';
import {fromEvent, interval, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {
  VideoService
} from "../../modules/learning/knowledge-component/learning-objects/instructional-items/video/video.service";


@Injectable()
export class LearnerActivityService implements OnDestroy {

  private events: string[] = ['keydown', 'click', 'wheel', 'mousemove'];
  private sessionPaused = false;
  private checkUserActivitySubscription: Subscription;
  private eventsSubscriptions: Subscription[] = [];
  private videoStatus: string = null;
  private lastActive: Date = new Date();

  constructor(private http: HttpClient, private videoService: VideoService) {
    this.setUp()
    this.videoService.videoStatus$.subscribe(videoStatus => {
      this.videoStatus = videoStatus;
    })
  }

  ngOnDestroy(): void {
    this.checkUserActivitySubscription.unsubscribe();
    this.eventsSubscriptions.forEach(sub => sub.unsubscribe())
    this.videoService.videoStatus$.unsubscribe();
  }

  public checkUserActivity(kcId: number) {
    this.checkUserActivitySubscription = interval(1000)
      .subscribe(() => {
        let inactiveInMinutes = Math.floor(new Date().getTime() - this.lastActive.getTime())/60000
        if (inactiveInMinutes > 0.2 && this.videoStatus !== "PLAYING" && this.sessionPaused === false) {
          this.pauseSession(kcId).subscribe({
            next: () => {this.sessionPaused = true;},
            error: () => {}
          })
        } else if ((inactiveInMinutes < 0.1  && this.sessionPaused === true) || (this.videoStatus == "PLAYING" &&
        this.sessionPaused === true)) {
          this.continueSession(kcId).subscribe({
            next: () => {this.sessionPaused = false;},
            error: () => {}
          })
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
