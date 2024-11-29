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
  gradedCount: number;
  completedCount: number;
  learnerPoints: number;
  avgGroupPoints: number;
  totalMaxPoints: number;
  taskStatistics: TaskStatistics[];
}

export interface TaskStatistics {
  taskId: number;
  completionTime: Date;
  isGraded: boolean;
  wonPoints: number;
  negativePatterns: string[];
}