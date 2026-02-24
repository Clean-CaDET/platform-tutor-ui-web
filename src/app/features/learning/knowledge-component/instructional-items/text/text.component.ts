import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CcMarkdownComponent } from '../../../../../shared/markdown/cc-markdown.component';
import { TextLearningObject } from '../../../model/learning-object.model';

@Component({
  selector: 'cc-text-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CcMarkdownComponent],
  template: `
    <cc-markdown [clipboard]="true" [lineNumbers]="true">{{ item().content }}</cc-markdown>
  `,
})
export class TextItemComponent {
  readonly item = input.required<TextLearningObject>();
}
