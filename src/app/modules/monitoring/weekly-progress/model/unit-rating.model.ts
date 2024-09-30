export interface UnitProgressRating {
    learnerId: number;
    knowledgeUnitId: number;
    completedKcIds: number[];
    completedKcNames?: string[];
    completedTaskIds: number[];
    completedTaskNames?: string[];
    created?: Date;
    feedback: {
        learnerProgress: number | null;
        instructionClarity: number | null;
        assessmentClarity: number | null;
        taskChallenge: number | string | null;
        comment: string;
    }
    isLearnerInitiated: boolean;
}

export function getChallengeRatingLabel(challengeRating: number | string) {
    switch(challengeRating) {
        case -2: return "Veoma teški";
        case -1: return "Teški";
        case 0: return "Taman";
        case 1: return "Laki";
        case 2: return "Veoma laki";
    }
    return challengeRating;
}