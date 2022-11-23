import { Component, OnInit } from '@angular/core';
import { InterfacingInstructor } from 'src/app/modules/group-monitoring/instructor/interfacing-instructor.service';
import { shuffleArray } from 'src/app/shared/helpers/arrays';
import { LearningObjectComponent } from '../learning-object-component';
import { McqEvaluation } from './model/mcq-evaluation.model';
import { MultipleChoiceQuestion } from './model/multiple-choice-question.model';
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
    if (item != this.checked) return '';
    return this.evaluation.correctnessLevel == 1
      ? 'color-correct'
      : 'color-wrong';
  }
}
