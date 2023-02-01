import { Component, OnInit } from '@angular/core';
import { LearningObjectComponent } from '../../learning-object-component';
import { Text } from './text.model';

@Component({
  selector: 'cc-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements LearningObjectComponent {

  learningObject: Text;

  constructor() { }

}
