import {Component, OnInit} from '@angular/core';
import {LearningObjectComponent} from '../learning-object-component';
import {ShortAnswerQuestion} from './short-answer-question.model';
import {SaqEvaluation} from './saq-evaluation.model';
import {InterfacingInstructor} from '../../../instructor/interfacing-instructor.service';
import { ShortAnswerQuestionService } from './short-answer-question.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'cc-short-answer-question',
  templateUrl: './short-answer-question.component.html',
  styleUrls: ['./short-answer-question.component.scss']
})
export class ShortAnswerQuestionComponent implements LearningObjectComponent, OnInit {
  learningObject: ShortAnswerQuestion;
  response: SaqEvaluation;
  answer: string;
  private kcId: number;

  constructor(private saqService: ShortAnswerQuestionService,
              private instructor: InterfacingInstructor,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.kcId = +params.kcId;
    });
  }

  onSubmit(): void {
    this.saqService.answerQuestion(this.learningObject.id, this.answer).subscribe(evaluation => {
      this.instructor.submit(evaluation.correctnessLevel, this.kcId);
      this.response = evaluation;
    });
  }
}
