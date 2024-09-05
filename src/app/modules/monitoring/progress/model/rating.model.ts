export interface WeeklyRatingStatistics {
    avgLearnerSatisfaction: number;
    avgGroupSatisfaction: number;
    avgTotalSatisfaction: number;
    learnerSatisfactionCount: number;
    groupSatisfactionCount: number;
    totalSatisfactionCount: number;
    comments: string[];
}

export interface UnitRatingStatistics {
    ratings: UnitProgressRating[];
    avgKcSatisfaction: number;
    avgKcGroupSatisfaction: number;
    kcSatisfactionCount: number;
    kcGroupSatisfactionCount: number;
}

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

// Calculations should be moved to the backend so that they can be testable.
// This requires structuring the rating.feedback and removing the generic JSON column.
// This refactoring should be done when we are sure of the usefulness of our rating structure.
export function calculateWeeklySatisfactionStatistics(ratings: UnitProgressRating[], selectedLearnerId: number, groupMemberIds: Set<number>): WeeklyRatingStatistics {
    let learnerSatisfactionGrades: number[] = [];
    let groupSatisfactionGrades: number[] = [];
    let totalSatisfactionGrades: number[] = [];
    let comments: string[] = [];

    ratings.forEach(rating => {
      if (isNaN(rating.feedback.learnerProgress)) return;
      totalSatisfactionGrades.push(rating.feedback.learnerProgress);
      if (rating.learnerId === selectedLearnerId) {
        if(rating.feedback.comment.trim()) comments.push(rating.feedback.comment);
        learnerSatisfactionGrades.push(rating.feedback.learnerProgress);
        groupSatisfactionGrades.push(rating.feedback.learnerProgress);
        return;
      }
      if (groupMemberIds.has(rating.learnerId)) {
        groupSatisfactionGrades.push(rating.feedback.learnerProgress);
      }
    });

    return {
      avgLearnerSatisfaction: calculateAverage(learnerSatisfactionGrades),
      avgGroupSatisfaction: calculateAverage(groupSatisfactionGrades),
      avgTotalSatisfaction: calculateAverage(totalSatisfactionGrades),
      learnerSatisfactionCount: learnerSatisfactionGrades.length,
      groupSatisfactionCount: groupSatisfactionGrades.length,
      totalSatisfactionCount: groupSatisfactionGrades.length,
      comments: comments
    };
}

function calculateAverage(grades: number[]): number {
    return grades.length > 0 ? grades.reduce((acc, value) => acc + value, 0) / grades.length : 0;
}

export function calculateUnitRatingStatistics(unitRatings: UnitProgressRating[], selectedLearnerId: number): UnitRatingStatistics {
    let selectedLearnerGrades: number[]  = [];
    let groupGrades: number[]  = [];
    unitRatings.forEach(rating => {
      if (isNaN(rating.feedback.instructionClarity)) return;
      const averageKcGrade = (rating.feedback.instructionClarity + rating.feedback.assessmentClarity) / 2;
      groupGrades.push(averageKcGrade);
      if (rating.learnerId === selectedLearnerId) {
        selectedLearnerGrades.push(averageKcGrade);
      }
    });

    return {
        ratings: unitRatings,
        avgKcSatisfaction: calculateAverage(selectedLearnerGrades),
        avgKcGroupSatisfaction: calculateAverage(groupGrades),
        kcSatisfactionCount: selectedLearnerGrades.length,
        kcGroupSatisfactionCount: groupGrades.length
    }
}