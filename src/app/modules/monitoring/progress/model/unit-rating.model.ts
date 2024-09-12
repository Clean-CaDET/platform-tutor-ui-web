export interface UnitProgressRating {
    learnerId: number;
    knowledgeUnitId: number;
    completedKcIds: number[];
    completedTaskIds: number[];
    created?: Date;
    feedback: {
        learnerProgress: number | null;
        instructionClarity: number | null;
        assessmentClarity: number | null;
        taskChallenge: number | null;
        comment: string;
    }
    isLearnerInitiated: boolean;
}