export type TurnRole = 'Learner' | 'System';

export interface ConversationTurn {
  id: number;
  role: TurnRole;
  content: string;
  order: number;
  timestamp: string;
}
