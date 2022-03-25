import { Component, OnInit } from '@angular/core';
import { NavbarService } from 'src/app/modules/layout/navbar/navbar.service';
import { AeService } from '../../knowledge-component/ae.service';
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
    private aeService: AeService,
    private navbarService: NavbarService) { }

  ngOnInit(): void {
  }

  reloadSubmission(): void {
    this.challengeService.getMaxCorrectness(this.learningObject.id).subscribe(correctness => {
      this.navbarService.updateContent('updateKnowledgeComponents');
      this.aeService.submit(correctness);
    });
  }

}
