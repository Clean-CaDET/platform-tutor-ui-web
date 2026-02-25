import { Component, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { takeUntil } from 'rxjs';
import { CcMarkdownComponent } from '../../../../shared/markdown/cc-markdown.component';
import { Activity } from '../model/activity.model';
import { ExamplePopupComponent } from '../example-popup/example-popup.component';

@Component({
  selector: 'cc-subactivities',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkAccordionModule, MatIconModule, MatButtonModule, CcMarkdownComponent, SubactivitiesComponent],
  templateUrl: './subactivities.component.html',
  styleUrl: './subactivities.component.scss',
})
export class SubactivitiesComponent {
  private readonly dialog = inject(MatDialog);

  readonly selectedStep = input.required<Activity>();
  readonly order = input.required<string>();
  readonly videoStatusChanged = output<{ data: number; videoUrl?: string }>();

  showExample(event: MouseEvent, subactivity: Activity): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ExamplePopupComponent, {
      data: subactivity,
    });

    dialogRef.componentInstance.videoStatusChanged
      .pipe(takeUntil(dialogRef.afterClosed()))
      .subscribe(data => this.videoStatusChanged.emit(data));
  }
}
