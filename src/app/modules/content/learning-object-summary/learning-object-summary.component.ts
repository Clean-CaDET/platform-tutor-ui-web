import {Component, Input, OnInit} from '@angular/core';
import {LearningObjectSummary} from './model/learning-object-summary';
import {VideoComponent} from '../learning-objects/video/video.component';
import {ImageComponent} from '../learning-objects/image/image.component';
import {TextComponent} from '../learning-objects/text/text.component';

@Component({
  selector: 'cc-learning-object-summary',
  templateUrl: './learning-object-summary.component.html',
  styleUrls: ['./learning-object-summary.component.css']
})
export class LearningObjectSummaryComponent implements OnInit {
  @Input() learningObjectSummary: LearningObjectSummary;
  VideoComponent = VideoComponent;
  ImageComponent = ImageComponent;
  TextComponent = TextComponent;

  constructor() {
  }

  ngOnInit(): void {
  }

}
