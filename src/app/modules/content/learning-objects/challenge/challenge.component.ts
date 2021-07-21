import { Component, OnInit } from '@angular/core';
import { LearningObjectComponent } from '../learning-object-component';
import { Challenge } from './model/challenge.model';

@Component({
  selector: 'cc-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.css']
})
export class ChallengeComponent implements OnInit, LearningObjectComponent {

  learningObject: Challenge;

  constructor() { }

  ngOnInit(): void {
  }

}
