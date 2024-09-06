import { UnitHeader } from "./unit-header.model";

export interface WeeklyGradeStatistics {
    learnerPoints: number;
    avgGroupPoints: number; // sum(totalCount*avgGroup) / sum(totalCount)
}

export interface KcProgressStatistics {
    totalCount: number;
    satisfiedCount: number;

    negativeInstructionalPatterns: string[];
    negativeAssessmentPatterns: string[];
}

export interface TaskProgressStatistics {
    totalCount: number;
    completedCount: number;

    learnerPoints: number;
    avgGroupPoints: number;

    negativePatterns: string[];
}

export interface UnitProgressStatistics {
    unitId: number;
    kcStatistics: KcProgressStatistics;
    taskStatistics: TaskProgressStatistics;
    taskPoints: {
        taskId: number,
        wonPoints: number
    }[];
}

export function calculateWeeklyGradeStatistics(units: UnitHeader[]): WeeklyGradeStatistics {
  let totalLearnerPoints = 0;
  let totalGroupPoints = 0;
  let totalTaskCount = 0;
  units.forEach(u => {
    totalLearnerPoints += u.taskStatistics.learnerPoints;
    totalGroupPoints += u.taskStatistics.avgGroupPoints * u.taskStatistics.totalCount;
    totalGroupPoints += u.taskStatistics.totalCount;
  });
  return {
    learnerPoints: totalLearnerPoints,
    avgGroupPoints: totalGroupPoints / totalTaskCount
  };
}