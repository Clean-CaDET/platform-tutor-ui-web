import { Component, ChangeDetectionStrategy, inject, signal, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { KnowledgeComponent } from '../../../shared/model/knowledge-component.model';
import { LearningObject, AssessmentItem } from '../model/learning-object.model';
import { KnowledgeComponentService } from './knowledge-component.service';
import { SessionPauseService } from './session-pause.service';
import { LearningObjectContainerComponent } from './learning-object-container/learning-object-container.component';
import { SubmissionResultComponent } from './submission-result/submission-result.component';
import { AssessmentItemListComponent } from './assessment-item-list/assessment-item-list.component';
import { getRouteParams } from '../../../core/route.util';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'cc-knowledge-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, MatButtonModule, MatDividerModule, MatIconModule,
    LearningObjectContainerComponent, SubmissionResultComponent, AssessmentItemListComponent,
  ],
  templateUrl: './knowledge-component.component.html',
  styleUrl: './knowledge-component.component.scss',
})
export class KnowledgeComponentComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly kcService = inject(KnowledgeComponentService);
  private readonly sessionPause = inject(SessionPauseService);

  readonly kc = signal<KnowledgeComponent | null>(null);
  readonly learningObjects = signal<LearningObject[]>([]);
  readonly assessmentItems = signal<AssessmentItem[]>([]);
  readonly mode = signal<'instruction' | 'assessment' | 'review'>('instruction');
  readonly isSatisfied = signal(false);

  readonly kcId: number;
  readonly unitId: number;
  readonly courseId: number;

  constructor() {
    const params = getRouteParams(this.route);
    this.kcId = +params['kcId'];
    this.unitId = +params['unitId'];
    this.courseId = +params['courseId'];

    this.kcService.getKnowledgeComponent(this.kcId).subscribe(kc => this.kc.set(kc));
    this.kcService.launchSession(this.kcId).subscribe();
    this.sessionPause.start(this.kcId);
    this.loadInstructionalItems();
    this.kcService.getStatistics(this.kcId).subscribe(stats => {
      this.isSatisfied.set(stats.isSatisfied);
    });
  }

  ngOnDestroy(): void {
    this.sessionPause.stop();
    this.kcService.terminateSession(this.kcId).subscribe();
  }

  @HostListener('window:beforeunload')
  onBeforeUnload(): void {
    this.sessionPause.stop();
    this.kcService.abandonSession(this.kcId).subscribe();
  }

  onInstructionalItemsClicked(): void {
    this.loadInstructionalItems();
    this.mode.set('instruction');
    this.scrollToTop();
    this.kcService.getStatistics(this.kcId).subscribe(stats => {
      this.isSatisfied.set(stats.isSatisfied);
    });
  }

  onAssessmentItemClicked(): void {
    this.kcService.getSuitableAssessmentItem(this.kcId).subscribe(item => {
      this.learningObjects.set([item]);
      this.mode.set('assessment');
      this.scrollToTop();
    });
  }

  onReviewAssessmentsClicked(): void {
    this.kcService.getAssessmentItems(this.kcId).subscribe(items => {
      this.assessmentItems.set(items);
      this.mode.set('review');
      this.scrollToTop();
    });
  }

  onChangePage(page: 'AE' | 'IE'): void {
    if (page === 'AE') {
      this.onAssessmentItemClicked();
    } else {
      this.onInstructionalItemsClicked();
    }
  }

  private loadInstructionalItems(): void {
    this.kcService.getInstructionalItems(this.kcId).subscribe(items => {
      this.learningObjects.set(items);
    });
  }

  private scrollToTop(): void {
    setTimeout(() => {
      document.getElementById('kc-scroller')?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  }
}
