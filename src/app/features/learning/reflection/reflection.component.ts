import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { CcMarkdownComponent } from '../../../shared/markdown/cc-markdown.component';
import { getRouteParams } from '../../../core/route.util';
import { ReflectionService } from './reflection.service';
import { Reflection, ReflectionQuestionAnswer, ReflectionQuestionType } from './reflection.model';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'cc-reflection',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink, ReactiveFormsModule,
    MatDividerModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSliderModule,
    CcMarkdownComponent,
  ],
  templateUrl: './reflection.component.html',
  styleUrl: './reflection.component.scss',
})
export class ReflectionComponent {
  private readonly service = inject(ReflectionService);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly fb = inject(FormBuilder);

  readonly reflection = signal<Reflection | null>(null);
  readonly isSatisfied = signal(false);
  readonly form = signal<FormGroup | null>(null);

  protected readonly unitId: number;
  protected readonly courseId: number;

  readonly ReflectionQuestionType = ReflectionQuestionType;

  constructor() {
    const params = getRouteParams(this.route);
    this.unitId = +params['unitId'];
    this.courseId = +params['courseId'];
    this.loadReflection(+params['reflectionId']);
  }

  private loadReflection(reflectionId: number): void {
    if (!reflectionId) return;

    this.service.get(reflectionId).subscribe(reflection => {
      reflection.questions.sort((a, b) => a.order - b.order);
      this.reflection.set(reflection);
      this.isSatisfied.set((reflection.submissions?.length ?? 0) > 0);
      this.title.setTitle(`${reflection.name} - Tutor`);
      this.createForm(reflection);
    });
  }

  private createForm(reflection: Reflection): void {
    const group: Record<string, unknown[]> = {};
    reflection.questions.forEach(q => {
      const existingAnswer = this.findAnswer(reflection, q.id);
      if (q.type === ReflectionQuestionType.OpenEnded) {
        group[q.id] = [existingAnswer || ''];
      } else if (q.type === ReflectionQuestionType.Slider) {
        const value = existingAnswer ? +existingAnswer : Math.ceil((1 + (q.labels?.length ?? 1)) / 2);
        group[q.id] = [value];
      }
    });
    this.form.set(this.fb.group(group));
  }

  private findAnswer(reflection: Reflection, questionId: number): string | null {
    if (!reflection.submissions?.length) return null;
    const answers = reflection.submissions[0].answers;
    return answers.find(a => a.questionId === questionId)?.answer ?? null;
  }

  onSubmit(): void {
    const f = this.form();
    if (!f || !f.valid) return;

    const r = this.reflection()!;
    const formValues = f.value;
    const answers: ReflectionQuestionAnswer[] = r.questions.map(q => ({
      questionId: q.id,
      answer: String(formValues[q.id]),
    }));

    this.service.submit(r.id, { answers }).subscribe(() => {
      this.reflection.update(ref => ref ? { ...ref, submissions: [{ answers }] } : ref);
      this.isSatisfied.set(true);
    });
  }
}
