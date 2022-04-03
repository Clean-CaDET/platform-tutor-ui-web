import { Component, OnInit } from '@angular/core';
import { InterfacingInstructor } from '../../../instructor/interfacing-instructor.service';
import { LearningObjectComponent } from '../learning-object-component';
import { Challenge } from './challenge.model';
import { ChallengeService } from './challenge.service';

@Component({
  selector: 'cc-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css']
})
export class ChallengeComponent implements OnInit, LearningObjectComponent {

  learningObject: Challenge;

  constructor(private challengeService: ChallengeService,
    private instructor: InterfacingInstructor) { }

  ngOnInit(): void {
  }

  reloadSubmission(): void {
    this.challengeService.getMaxCorrectness(this.learningObject.id).subscribe(correctness => {
      this.instructor.submit(correctness);
    });
  }

}
