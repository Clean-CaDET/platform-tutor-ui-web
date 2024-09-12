import { UnitHeader } from "./unit-header.model";

export interface UnitProgressStatistics {
  unitId: number;
  kcStatistics: KcProgressStatistics;
  taskStatistics: TaskProgressStatistics;
}

export interface KcProgressStatistics {
  totalCount: number;
  satisfiedCount: number;
  satisfiedKcStatistics: KcStatistics[];
}

export interface KcStatistics {
  kcId: number;
  satisfactionTime: Date;
  negativePatterns: string[];
}

export interface TaskProgressStatistics {
  totalCount: number;
  completedCount: number;
  learnerPoints: number;
  avgGroupPoints: number;

  gradedTaskStatistics: TaskStatistics[];
}

export interface TaskStatistics {
  taskId: number;
  completionTime: Date;
  wonPoints: number;
  negativePatterns: string[];
}



export interface WeeklyProgressStatistics {
  totalKcCount: number;
  totalTaskCount: number;
  
  learnerSatisfiedKcCount: number;
  learnerGradedTaskCount: number;
  
  totalLearnerPoints: number;
  avgGroupPoints: number;
}

export function calculateWeeklyProgressStatistics(units: UnitHeader[]): WeeklyProgressStatistics {
  let totalKcCount = 0;
  let totalTaskCount = 0;
  let learnerSatisfiedKcCount = 0;
  let learnerGradedTaskCount = 0;
  let totalLearnerPoints = 0;
  let avgGroupPoints = 0;

  units.forEach(u => {
    totalKcCount += u.kcStatistics.totalCount;
    totalTaskCount += u.taskStatistics.totalCount;
    learnerSatisfiedKcCount += u.kcStatistics.satisfiedCount;
    learnerGradedTaskCount += u.taskStatistics.completedCount;
    totalLearnerPoints += u.taskStatistics.learnerPoints;
    avgGroupPoints += u.taskStatistics.avgGroupPoints;
  });

  return {
    totalKcCount,
    totalTaskCount,
    learnerSatisfiedKcCount,
    learnerGradedTaskCount,
    totalLearnerPoints,
    avgGroupPoints
  };
}