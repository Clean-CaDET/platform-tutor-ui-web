import { Component, OnInit } from '@angular/core';
import { InterfacingInstructor } from 'src/app/modules/learning-utilities/interfacing-instructor.service';
import { KnowledgeComponentService } from '../../../knowledge-component.service';
import { LearningObjectComponent } from '../../learning-object-component';
import { Challenge } from './challenge.model';

@Component({
  selector: 'cc-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css'],
})
export class ChallengeComponent implements OnInit, LearningObjectComponent {
  learningObject: Challenge;

  constructor(
    private knowledgeComponentService: KnowledgeComponentService,
    private instructor: InterfacingInstructor
  ) {}

  ngOnInit(): void {}

  reloadSubmission(): void {
    this.knowledgeComponentService
      .getAssesmentItemStatistics(this.learningObject.id)
      .subscribe((correctness) => {
        this.instructor.submit(this.learningObject.id, correctness);
      });
  }
}
