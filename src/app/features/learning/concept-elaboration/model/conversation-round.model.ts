export interface ConversationRound {
  order: number;
  elaborationContent: string;
  submittedAt: string;
  feedbackContent: string | null;
}
