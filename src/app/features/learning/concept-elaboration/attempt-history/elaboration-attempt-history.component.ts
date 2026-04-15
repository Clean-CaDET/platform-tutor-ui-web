import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { CcMarkdownComponent } from '../../../../shared/markdown/cc-markdown.component';
import { ConversationAttempt } from '../model/conversation-attempt.model';
import { AttemptStatus } from '../model/attempt-status.model';
import { ElaborationTranscriptComponent } from '../transcript/elaboration-transcript.component';

@Component({
  selector: 'cc-elaboration-attempt-history',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, MatExpansionModule, CcMarkdownComponent, ElaborationTranscriptComponent],
  templateUrl: './elaboration-attempt-history.component.html',
  styleUrl: './elaboration-attempt-history.component.scss',
})
export class ElaborationAttemptHistoryComponent {
  readonly attempts = input.required<ConversationAttempt[]>();

  statusLabel(status: AttemptStatus): string {
    switch (status) {
      case 'InProgress': return 'U toku';
      case 'Completed': return 'Rešen';
      case 'Abandoned': return 'Napušten';
      case 'Expired': return 'Stigao do granice';
      case 'Blocked': return 'Blokiran';
    }
  }
}
