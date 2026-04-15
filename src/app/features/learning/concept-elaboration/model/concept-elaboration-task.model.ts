import { ConversationAttempt } from './conversation-attempt.model';

export interface ConceptElaborationTask {
  id: number;
  unitId: number;
  order: number;
  title: string;
  canonicalDefinition: string;
  attempts: ConversationAttempt[];
}
