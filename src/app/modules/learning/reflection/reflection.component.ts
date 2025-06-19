import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Reflection, ReflectionQuestionAnswer, ReflectionQuestionType } from './reflection.model';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { ReflectionService } from './reflection.service';

@Component({
  selector: 'cc-reflection',
  templateUrl: './reflection.component.html',
  styleUrl: './reflection.component.scss'
})
export class ReflectionComponent {
  reflection: Reflection;
  isSatisfied: boolean;
  form: FormGroup;

  unitId: number;
  courseId: number;

  constructor(private service: ReflectionService, private route: ActivatedRoute, private title: Title, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.unitId = +params.unitId;
      this.courseId = +params.courseId;
      if(+params.rId) {
        this.service.get(+params.rId).subscribe(reflection => {
          this.reflection = reflection;
          this.isSatisfied = reflection.submissions?.length > 0;
          this.reflection.questions.sort((a, b) => a.order - b.order);
          this.title.setTitle(`Tutor - ${this.reflection.name}`);
          this.createForm();
        });
      }
    });
  }

  private createForm() {
    const group: any = {};
    this.reflection.questions.forEach(q => {
      const existingAnswer = this.findAnswer(q.id);
      if (q.type === ReflectionQuestionType.OpenEnded) {
        group[q.id] = [existingAnswer || ''];
      } else if (q.type === ReflectionQuestionType.Slider) {
        const value = +existingAnswer || Math.ceil((1 + q.labels?.length) / 2);
        group[q.id] = [value]; // Podrazumevano za slider
      }
    });
    this.form = this.fb.group(group);
  }
  
  private findAnswer(questionId: number): string {
    if(!this.reflection.submissions?.length) return null;
    const answers = this.reflection.submissions[0].answers;
    return answers.find(a => a.questionId === questionId)?.answer;
  }

  onSubmit() {
    if (!this.form.valid) return;

    const formValues = this.form.value;
    const answers: ReflectionQuestionAnswer[] = this.reflection.questions.map(q => ({
      questionId: q.id,
      answer: String(formValues[q.id])
    }));

    this.service.submit(this.reflection.id, { answers }).subscribe(() => {
      this.reflection.submissions = [{ answers }];
      this.isSatisfied = true;
    });
  }
}