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
  learnerPoints: number;
  avgGroupPoints: number;
  totalMaxPoints: number;
  gradedTaskStatistics: TaskStatistics[];
}

export interface TaskStatistics {
  taskId: number;
  completionTime: Date;
  wonPoints: number;
  negativePatterns: string[];
}