import { UnitHeader } from "./unit-header.model";
import { UnitProgressRating } from "./unit-rating.model";

export interface WeeklyProgressStatistics {
  totalKcCount: number;
  totalTaskCount: number;
  satisfiedKcCount: number;
  gradedTaskCount: number;
  completedTaskCount: number;
  achievedPoints: number;
  totalMaxPoints: number;
  percentPoints: number;
  avgGroupPoints: number;

  negativePatterns: {
    name: string;
    count: number;
  }[];
}
  
export function calculateWeeklyProgressStatistics(units: UnitHeader[]): WeeklyProgressStatistics {
  let totalKcCount = 0;
  let totalTaskCount = 0;
  let satisfiedKcCount = 0;
  let gradedTaskCount = 0;
  let completedTaskCount = 0;
  let achievedPoints = 0;
  let totalMaxPoints = 0;
  let avgGroupPoints = 0;
  let negativePatterns: {name: string, count: number}[] = [];
  
  units.forEach(u => {
    if(u.kcStatistics) {
      totalKcCount += u.kcStatistics.totalCount;
      satisfiedKcCount += u.kcStatistics.satisfiedCount;
      const kcNegativePatterns = u.kcStatistics.satisfiedKcStatistics.flatMap(stats => stats.negativePatterns);
      kcNegativePatterns.forEach(pattern => {
        const patternCategory = pattern.split(':')[0];
        const matchingPatternCategory = negativePatterns.find(p => p.name === patternCategory);
        if(matchingPatternCategory) {
          matchingPatternCategory.count++;
          return;
        }
        negativePatterns.push({name: patternCategory, count: 1});
      })
    }
    if(u.taskStatistics) {
      totalTaskCount += u.taskStatistics.totalCount;
      gradedTaskCount += u.taskStatistics.gradedCount;
      completedTaskCount += u.taskStatistics.completedCount;
      achievedPoints += u.taskStatistics.learnerPoints;
      avgGroupPoints += u.taskStatistics.avgGroupPoints;
      totalMaxPoints += u.taskStatistics.totalMaxPoints;
      const taskNegativePatterns = u.taskStatistics.taskStatistics.flatMap(stats => stats.negativePatterns);
      taskNegativePatterns.forEach(pattern => {
        const patternCategory = pattern.split(':')[0];
        const matchingPatternCategory = negativePatterns.find(p => p.name === patternCategory);
        if(matchingPatternCategory) {
          matchingPatternCategory.count++;
          return;
        }
        negativePatterns.push({name: patternCategory, count: 1});
      })
    }
  });
  
  return {
    totalKcCount,
    totalTaskCount,
    satisfiedKcCount,
    gradedTaskCount,
    completedTaskCount,
    totalMaxPoints,
    achievedPoints,
    percentPoints: +(100 * achievedPoints / totalMaxPoints).toFixed(0), // Course monitoring doubles this calculation and it should be centralized on the backend
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
  comments: RatingComment[];
}

export interface RatingComment {
  text: string;
  created: Date;
}

// Calculations should be moved to the backend so that they can be testable.
// This requires structuring the rating.feedback and removing the generic JSON column.
// This refactoring should be done when we are sure of the usefulness of our rating structure.
export function calculateWeeklySatisfactionStatistics(ratings: UnitProgressRating[], selectedLearnerId: number, groupMemberIds: Set<number>): WeeklyRatingStatistics {
    let learnerSatisfactionGrades: number[] = [];
    let groupSatisfactionGrades: number[] = [];
    let totalSatisfactionGrades: number[] = [];
    let comments: RatingComment[] = [];

    ratings.forEach(rating => {
      if (isNaN(rating.feedback.learnerProgress)) return;
      totalSatisfactionGrades.push(rating.feedback.learnerProgress);
      if (rating.learnerId === selectedLearnerId) {
        if(rating.feedback.comment.trim()) comments.push({
          text: rating.feedback.comment,
          created: rating.created
        });
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
      totalSatisfactionCount: totalSatisfactionGrades.length,
      comments: comments.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
    };
}

function calculateAverage(grades: number[]): number {
  if(grades.length === 0) return 0;
  let sum = 0;
  grades.forEach(grade => {
    sum += +grade;
  });
  return Math.round(sum * 10 / grades.length) / 10;
}