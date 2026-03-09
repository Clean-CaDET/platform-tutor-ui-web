import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject } from 'rxjs';
import { YouTubePlayer } from '@angular/youtube-player';
import { Activity } from '../model/activity.model';
import { ActivityExample } from '../model/activity-example.model';

@Component({
  selector: 'cc-example-popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule, YouTubePlayer],
  template: `
    <div class="flex-col" style="padding: 10px">
      <youtube-player (stateChange)="onVideoStatusChanged($event)"
        [width]="540" [height]="300" [videoId]="videoUrl()"></youtube-player>
      <div class="flex-row gap" style="margin-top: 10px; margin: 0 auto;">
        @if (selectedStep.examples && selectedStep.examples.length !== 1) {
          <button matButton="filled" (click)="getNextExample()">
            <mat-icon>image</mat-icon> Nov primer
          </button>
        }
        <button matButton (click)="dialogRef.close()">
          Zatvori
        </button>
      </div>
    </div>
  `,
})
export class ExamplePopupComponent {
  readonly dialogRef = inject(MatDialogRef<ExamplePopupComponent>);
  readonly selectedStep: Activity = inject(MAT_DIALOG_DATA);
  readonly videoStatusChanged = new Subject<{ data: number; videoUrl: string }>();

  readonly selectedExample = signal<ActivityExample>(this.selectedStep.examples![0]);
  readonly videoUrl = signal(this.extractVideoId(this.selectedStep.examples![0].url));

  getNextExample(): void {
    const examples = this.selectedStep.examples!;
    const index = examples.indexOf(this.selectedExample());
    const nextIndex = index < examples.length - 1 ? index + 1 : 0;
    this.selectedExample.set(examples[nextIndex]);
    this.videoUrl.set(this.extractVideoId(examples[nextIndex].url));
  }

  onVideoStatusChanged(event: { data: number }): void {
    if (event.data >= 0 && event.data <= 2) {
      this.videoStatusChanged.next({
        data: event.data,
        videoUrl: this.videoUrl(),
      });
    }
  }

  private extractVideoId(url: string): string {
    return url.split('/').pop()!.slice(-11);
  }
}
