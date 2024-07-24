import { Component } from '@angular/core';
import { LearningObjectComponent } from '../../learning-object-component';
import { Text } from './text.model';
import { ClipboardButtonComponent } from 'src/app/shared/markdown/clipboard-button/clipboard-button.component';

@Component({
  selector: 'cc-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements LearningObjectComponent {
  readonly clipboard = ClipboardButtonComponent;
  
  learningObject: Text;

  constructor() { }

}
