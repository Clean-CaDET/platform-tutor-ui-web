import { Component, ChangeDetectionStrategy, inject, input, signal, effect, untracked } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { WeeklyFeedbackService } from './weekly-feedback.service';
import { createOpinions, WeeklyFeedback } from './weekly-feedback.model';
import { WeeklyProgressStatistics } from '../weekly-progress/model/weekly-summary.model';
import { DeleteFormComponent } from '../../../shared/generics/delete-form/delete-form.component';
import { QuestionGroup, QuestionOptions } from './weekly-feedback-questions.service';

@Component({
  selector: 'cc-weekly-feedback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule,
    MatSliderModule, MatTooltipModule, MatProgressBarModule,
  ],
  templateUrl: './weekly-feedback.component.html',
  styleUrl: './weekly-feedback.component.scss',
})
export class WeeklyFeedbackComponent {
  private readonly feedbackService = inject(WeeklyFeedbackService);
  private readonly dialog = inject(MatDialog);

  readonly courseId = input.required<number>();
  readonly learnerId = input.required<number>();
  readonly selectedDate = input.required<Date>();
  readonly questionGroups = input.required<QuestionGroup[]>();
  readonly avgLearnerSatisfaction = input<number>(0);
  readonly results = input<WeeklyProgressStatistics | null>(null);
  readonly loaded = input(false);
  readonly reflectionIds = input<number[]>([]);

  readonly feedback = signal<WeeklyFeedback[]>([]);
  readonly selectedFeedback = signal<WeeklyFeedback | null>(null);
  readonly progressBarActive = signal(false);

  form: FormGroup | null = null;
  private formInitialized = false;

  constructor() {
    effect(() => {
      const groups = this.questionGroups();
      if (groups?.length && !this.formInitialized) {
        this.initForm(groups);
        this.formInitialized = true;
      }
    });

    effect(() => {
      const courseId = this.courseId();
      const learnerId = this.learnerId();
      this.feedbackService.getByCourseAndLearner(courseId, learnerId).subscribe(fb => {
        this.feedback.set(fb);
        this.selectOrInitializeFeedback();
      });
    });

    toObservable(this.selectedDate).pipe(
      skip(1),
      takeUntilDestroyed(),
    ).subscribe(() => {
      if (!this.feedback().length) return;
      this.feedback.update(list => list.filter(f => f.id));
      this.selectOrInitializeFeedback();
    });

    effect(() => {
      const results = this.results();
      if (!results) return;
      const sf = untracked(() => this.selectedFeedback());
      if (sf?.id) return;
      const opinions = createOpinions(results);
      opinions?.forEach(o => this.form?.get(o.code)?.setValue(o.value));
    });
  }

  private initForm(groups: QuestionGroup[]): void {
    const formControls: Record<string, FormControl> = {};
    for (const group of groups) {
      for (const question of group.questions) {
        const defaultOption = question.options.find(o => o.isDefault);
        formControls[question.code] = new FormControl(defaultOption?.value ?? question.options[0].value);
      }
    }
    formControls['semaphore'] = new FormControl('2');
    formControls['semaphoreJustification'] = new FormControl('');
    this.form = new FormGroup(formControls);
  }

  private selectOrInitializeFeedback(): void {
    const selected = this.findFeedbackForSelectedDate();
    if (selected) {
      this.selectFeedback(selected);
      return;
    }
    this.createNewFeedback();
  }

  private findFeedbackForSelectedDate(): WeeklyFeedback | undefined {
    return this.feedback().find(f => {
      const startDate = new Date(f.weekEnd);
      startDate.setDate(startDate.getDate() - 2);
      const endDate = new Date(f.weekEnd);
      endDate.setDate(endDate.getDate() + 2);
      return this.selectedDate() >= startDate && this.selectedDate() <= endDate;
    });
  }

  private createNewFeedback(): void {
    const filtered = this.feedback().filter(i => i.id);
    const selectedDate = new Date(this.selectedDate());
    selectedDate.setDate(selectedDate.getDate() + 1);
    const newFeedback: WeeklyFeedback = {
      weekEnd: selectedDate,
      semaphore: 2,
      semaphoreJustification: '',
      learnerId: this.learnerId(),
    };
    this.selectFeedback(newFeedback);
    for (const group of this.questionGroups()) {
      for (const question of group.questions) {
        const defaultOption = question.options.find(o => o.isDefault);
        if (!defaultOption) continue;
        this.form?.get(question.code)?.setValue(defaultOption.value);
      }
    }
    const updated = [...filtered, newFeedback];
    updated.sort((a, b) => new Date(a.weekEnd).getTime() - new Date(b.weekEnd).getTime());
    this.feedback.set(updated);
  }

  selectFeedback(fb: WeeklyFeedback): void {
    this.selectedFeedback.set(fb);
    if (this.form) {
      this.form.patchValue(fb);
      fb.opinions?.forEach(o => this.form!.get(o.code)?.setValue(o.value));
    }
  }

  onSubmit(): void {
    this.progressBarActive.set(true);
    const sf = this.selectedFeedback()!;
    sf.semaphore = this.form!.value.semaphore;
    sf.semaphoreJustification = this.form!.value.semaphoreJustification;
    this.populateOpinions();
    this.embedStatistics();

    if (sf.id) {
      this.feedbackService.update(this.courseId(), sf).subscribe({
        next: fb => {
          this.feedbackService.notify(fb);
          this.progressBarActive.set(false);
        },
        error: () => this.progressBarActive.set(false),
      });
    } else {
      this.feedbackService.create(this.courseId(), sf).subscribe({
        next: newFb => {
          sf.id = newFb.id;
          this.feedbackService.notify(newFb);
          this.progressBarActive.set(false);
        },
        error: () => this.progressBarActive.set(false),
      });
    }
  }

  private populateOpinions(): void {
    const sf = this.selectedFeedback()!;
    if (sf.id && !sf.opinions) return;

    sf.opinions = [];
    const questions = this.questionGroups().flatMap(g => g.questions);
    questions.forEach(q => {
      const value = this.form!.get(q.code)?.value;
      const label = q.options.find(o => o.value === value)?.label ?? '';
      sf.opinions!.push({ code: q.code, label, value });
    });
  }

  private embedStatistics(): void {
    const sf = this.selectedFeedback()!;
    const feedbackForSelectedDate = this.findFeedbackForSelectedDate();
    if (sf.id && feedbackForSelectedDate?.id !== sf.id) return;

    sf.averageSatisfaction = this.avgLearnerSatisfaction();
    sf.achievedTaskPoints = this.results()?.achievedPoints;
    sf.maxTaskPoints = this.results()?.totalMaxPoints;
    sf.reflectionIds = this.reflectionIds();
  }

  private readonly colorCssMap: Record<string, string> = {
    primary: 'var(--mat-sys-primary)',
    accent: 'light-dark(#7c6f00, #e6d44a)',
    warn: 'var(--mat-sys-error)',
  };

  getColorCss(formControlName: string, options?: QuestionOptions[]): string {
    const controlValue = this.form?.get(formControlName)?.value;
    let colorName: string;
    if (!options) {
      colorName = this.getStandardColors(controlValue);
    } else {
      colorName = options.find(o => o.value === controlValue)?.color ?? 'primary';
    }
    return this.colorCssMap[colorName] ?? this.colorCssMap['primary'];
  }

  getSemaphoreCss(f: WeeklyFeedback): string | null {
    if (!f.id) return 'var(--mat-sys-on-surface)';
    return this.colorCssMap[this.getStandardColors(f.semaphore)] ?? null;
  }

  getStandardColors(value: number): string {
    if (value === 1) return 'warn';
    if (value === 2) return 'accent';
    if (value === 3) return 'primary';
    return 'accent';
  }

  onDelete(id: number): void {
    const diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.progressBarActive.set(true);
      this.feedbackService.delete(this.courseId(), id).subscribe({
        next: () => {
          this.feedback.set(this.feedback().filter(i => i.id !== id));
          this.createNewFeedback();
          const opinions = createOpinions(this.results()!);
          opinions?.forEach(o => this.form?.get(o.code)?.setValue(o.value));
          this.feedbackService.notify(null);
          this.progressBarActive.set(false);
        },
        error: () => this.progressBarActive.set(false),
      });
    });
  }
}
