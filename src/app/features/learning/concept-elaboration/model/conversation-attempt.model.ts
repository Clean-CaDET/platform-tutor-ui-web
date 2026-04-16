import { AttemptStatus } from './attempt-status.model';
import { ConversationTurn } from './conversation-turn.model';

export interface ConversationAttempt {
  id: number;
  conceptElaborationTaskId: number;
  status: AttemptStatus;
  startedAt?: string;
  completedAt?: string;
  summary: string | null;
  turns: ConversationTurn[];
}
