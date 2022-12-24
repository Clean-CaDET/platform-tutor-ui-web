import { Component, OnInit } from '@angular/core';
import { InterfacingInstructor } from 'src/app/modules/learning-utilities/interfacing-instructor.service';
import { McqEvaluation } from 'src/app/modules/learning/model/learning-objects/multiple-choice-question/mcq-evaluation.model';
import { shuffleArray } from 'src/app/shared/helpers/arrays';
import { LearningObjectComponent } from '../../learning-object-component';
import { MultipleChoiceQuestion } from './multiple-choice-question.model';
import { MultipleChoiceQuestionService } from './multiple-choice-question.service';

@Component({
  selector: 'cc-multiple-choice-question',
  templateUrl: './multiple-choice-question.component.html',
  styleUrls: ['./multiple-choice-question.component.scss'],
})
export class MultipleChoiceQuestionComponent
  implements OnInit, LearningObjectComponent
{
  learningObject: MultipleChoiceQuestion;
  checked: string;
  evaluation: McqEvaluation;

  constructor(
    private mcqService: MultipleChoiceQuestionService,
    private instructor: InterfacingInstructor
  ) {}

  ngOnInit(): void {
    this.learningObject.possibleAnswers = shuffleArray(
      this.learningObject.possibleAnswers
    );
  }

  onSubmit(): void {
    this.mcqService
      .submit(this.learningObject.id, this.checked)
      .subscribe((mcqEvaluation) => {
        this.instructor.submit(mcqEvaluation.correctnessLevel);
        this.evaluation = mcqEvaluation;
      });
  }

  checkItemCorrectness(item: string) {
    if (item !== this.checked) return '';
    return this.evaluation.correctnessLevel === 1
      ? 'color-correct'
      : 'color-wrong';
  }
}
