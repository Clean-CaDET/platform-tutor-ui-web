import { Component, ChangeDetectionStrategy, input, output, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VideoLearningObject } from '../../../../learning/model/learning-object.model';

@Component({
  selector: 'cc-video-authoring',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="flex-row">
      <span style="flex-grow: 1;"></span>
      <button matIconButton (click)="submit(false)">
        <mat-icon>check</mat-icon>
      </button>
      <button matIconButton (click)="submit(true)">
        <mat-icon>clear</mat-icon>
      </button>
    </div>
    <form [formGroup]="videoForm" class="flex-row gap">
      <mat-form-field style="width: 60%;">
        <mat-label>Naslov</mat-label>
        <input formControlName="caption" matInput>
      </mat-form-field>
      <mat-form-field style="width: 40%;">
        <mat-label>URL</mat-label>
        <input formControlName="url" matInput>
      </mat-form-field>
    </form>
  `,
})
export class VideoAuthoringComponent {
  readonly video = input.required<VideoLearningObject>();
  readonly videoCreated = output<VideoLearningObject | null>();

  readonly videoForm = new FormGroup({
    caption: new FormControl('', { validators: Validators.required, nonNullable: true }),
    url: new FormControl('', { validators: Validators.required, nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const v = this.video();
      if (v) {
        this.videoForm.patchValue({ caption: v.caption ?? '', url: v.url ?? '' });
      }
    });
  }

  submit(cancel: boolean): void {
    if (cancel) {
      this.videoCreated.emit(null);
      return;
    }
    const v = this.video();
    const updated: VideoLearningObject = {
      ...v,
      caption: this.videoForm.controls.caption.value,
      url: this.videoForm.controls.url.value,
    };
    this.videoCreated.emit(updated);
  }
}
