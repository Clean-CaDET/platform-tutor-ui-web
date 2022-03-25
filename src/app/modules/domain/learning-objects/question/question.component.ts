import {Component, OnInit} from '@angular/core';
import {LearningObjectComponent} from '../learning-object-component';
import {Question} from './model/question.model';
import {QuestionService} from './question.service';
import {MrqItem} from './model/answer.model';
import {shuffleArray} from '../../../../shared/helpers/arrays';
import {MrqEvaluation} from './model/mrq-evaluation.model';
import {MrqItemEvaluation} from './model/mrq-item-evaluation.model';
import {AeService} from '../../knowledge-component/ae.service';
import {NavbarService} from '../../../layout/navbar/navbar.service';

@Component({
  selector: 'cc-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, LearningObjectComponent {
  learningObject: Question;
  checked: boolean[];
  evaluation: MrqEvaluation;

  constructor(private questionService: QuestionService,
              private aeService: AeService,
              private navbarService: NavbarService) {
    this.checked = [];
  }

  ngOnInit(): void {
    this.learningObject.items = shuffleArray(this.learningObject.items);
  }

  get checkedAnswers(): MrqItem[] {
    const checkedAnswers = [];
    for (let i = 0; i < this.checked.length; i++) {
      if (this.checked[i]) {
        checkedAnswers.push(this.learningObject.items[i]);
      }
    }
    return checkedAnswers;
  }

  onSubmit(): void {
    this.questionService.answerQuestion(this.learningObject.id, this.checkedAnswers)
      .subscribe(mrqEvaluation => {
        this.navbarService.updateContent('updateKnowledgeComponents');
        this.aeService.submit(mrqEvaluation.correctnessLevel);
        this.evaluation = mrqEvaluation;
      });
  }

  getAnswerResult(answerId: number): MrqItemEvaluation {
    return this.evaluation.itemEvaluations.find(item => item.id === answerId);
  }
}
