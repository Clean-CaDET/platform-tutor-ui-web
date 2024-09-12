import { UnitHeader } from "./unit-header.model";
import { UnitProgressRating } from "./unit-rating.model";

export interface WeeklyProgressStatistics {
  totalKcCount: number;
  totalTaskCount: number;
  learnerSatisfiedKcCount: number;
  learnerGradedTaskCount: number;
  totalMaxPoints: number;
  totalLearnerPoints: number;
  avgGroupPoints: number;

  negativePatterns: {
    name: string;
    count: number;
  }[];
}
  
export function calculateWeeklyProgressStatistics(units: UnitHeader[]): WeeklyProgressStatistics {
  let totalKcCount = 0;
  let totalTaskCount = 0;
  let learnerSatisfiedKcCount = 0;
  let learnerGradedTaskCount = 0;
  let totalMaxPoints = 0;
  let totalLearnerPoints = 0;
  let avgGroupPoints = 0;
  let negativePatterns: {name: string, count: number}[] = [];
  
  units.forEach(u => {
    if(u.kcStatistics) {
      totalKcCount += u.kcStatistics.totalCount;
      learnerSatisfiedKcCount += u.kcStatistics.satisfiedCount;
      const kcNegativePatterns = u.kcStatistics.satisfiedKcStatistics.flatMap(stats => stats.negativePatterns);
      kcNegativePatterns.forEach(pattern => {
        const matchingPattern = negativePatterns.find(p => p.name === pattern);
        if(!matchingPattern) {
          matchingPattern.count++;
          return;
        }
        negativePatterns.push({name: pattern, count: 1});
      })
    }
    if(u.taskStatistics) {
      totalTaskCount += u.taskStatistics.totalCount;
      learnerGradedTaskCount += u.taskStatistics.completedCount;
      totalLearnerPoints += u.taskStatistics.learnerPoints;
      avgGroupPoints += u.taskStatistics.avgGroupPoints;
      totalMaxPoints += u.taskStatistics.totalMaxPoints
    }
  });
  
  return {
    totalKcCount,
    totalTaskCount,
    learnerSatisfiedKcCount,
    learnerGradedTaskCount,
    totalMaxPoints,
    totalLearnerPoints,
    avgGroupPoints,
    negativePatterns
  };
}

export interface WeeklyRatingStatistics {
  avgLearnerSatisfaction: number;
  avgGroupSatisfaction: number;
  avgTotalSatisfaction: number;
  learnerSatisfactionCount: number;
  groupSatisfactionCount: number;
  totalSatisfactionCount: number;
  comments: string[];
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