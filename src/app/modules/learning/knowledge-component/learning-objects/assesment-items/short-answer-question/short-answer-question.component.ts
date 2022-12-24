import { Component } from '@angular/core';
import { ShortAnswerQuestion } from './short-answer-question.model';
import { ShortAnswerQuestionService } from './short-answer-question.service';
import { LearningObjectComponent } from '../../learning-object-component';
import { InterfacingInstructor } from 'src/app/modules/learning-utilities/interfacing-instructor.service';
import { SaqEvaluation } from 'src/app/modules/learning/model/learning-objects/short-answer-question/saq-evaluation.model';

@Component({
  selector: 'cc-short-answer-question',
  templateUrl: './short-answer-question.component.html',
  styleUrls: ['./short-answer-question.component.scss'],
})
export class ShortAnswerQuestionComponent implements LearningObjectComponent {
  learningObject: ShortAnswerQuestion;
  response: SaqEvaluation;
  answer: string;

  constructor(
    private saqService: ShortAnswerQuestionService,
    private instructor: InterfacingInstructor
  ) {}

  onSubmit(): void {
    this.saqService
      .answerQuestion(this.learningObject.id, this.answer)
      .subscribe((evaluation) => {
        this.instructor.submit(evaluation.correctnessLevel);
        this.response = evaluation;
      });
  }
}
