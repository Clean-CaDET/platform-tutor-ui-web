import { AttemptStatus } from './attempt-status.model';
import { ConversationRound } from './conversation-round.model';

export interface ConversationAttempt {
  id: number;
  conceptElaborationTaskId: number;
  status: AttemptStatus;
  startedAt?: string;
  completedAt?: string;
  summary: string | null;
  rounds: ConversationRound[];
}
