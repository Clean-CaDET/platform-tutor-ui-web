import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CcMarkdownComponent } from '../../../../shared/markdown/cc-markdown.component';
import { ConversationTurn } from '../model/conversation-turn.model';

@Component({
  selector: 'cc-elaboration-transcript',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CcMarkdownComponent],
  templateUrl: './elaboration-transcript.component.html',
  styleUrl: './elaboration-transcript.component.scss',
})
export class ElaborationTranscriptComponent {
  readonly turns = input.required<ConversationTurn[]>();
  readonly isStreaming = input(false);
}
