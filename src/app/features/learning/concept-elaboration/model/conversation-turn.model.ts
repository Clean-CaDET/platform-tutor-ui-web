export type TurnRole = 'Learner' | 'System';

export interface ConversationTurn {
  id: number;
  role: TurnRole;
  content: string;
  isSubstantive: boolean;
  order: number;
  timestamp: string;
}
