import {Component} from '@angular/core';
import {LearningObjectComponent} from '../learning-object-component';
import {ShortAnswerQuestion} from './short-answer-question.model';
import {SaqEvaluation} from './saq-evaluation.model';
import {AeSubmissionService} from '../../knowledge-component/ae.service';
import { ShortAnswerQuestionService } from './short-answer-question.service';

@Component({
  selector: 'cc-short-answer-question',
  templateUrl: './short-answer-question.component.html',
  styleUrls: ['./short-answer-question.component.scss']
})
export class ShortAnswerQuestionComponent implements LearningObjectComponent {
  learningObject: ShortAnswerQuestion;
  response: SaqEvaluation;
  answer: string;

  constructor(private saqService: ShortAnswerQuestionService,
              private aeService: AeSubmissionService) {
  }

  onSubmit(): void {
    this.saqService.answerQuestion(this.learningObject.id, this.answer).subscribe(evaluation => {
      this.aeService.submit(evaluation.correctnessLevel);
      this.response = evaluation;
    });
  }
}
