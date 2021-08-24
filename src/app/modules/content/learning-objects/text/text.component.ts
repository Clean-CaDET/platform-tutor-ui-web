import {Component, Input, OnInit} from '@angular/core';
import { LearningObjectComponent } from '../learning-object-component';
import { Text } from './model/text.model';

@Component({
  selector: 'cc-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit, LearningObjectComponent {

  @Input() learningObject: Text;

  constructor() { }

  ngOnInit(): void {
  }

}
