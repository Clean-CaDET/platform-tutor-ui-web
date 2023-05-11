export interface KnowledgeComponentStatistics {
  kcId: number;
  totalRegistered: number;
  totalStarted: number;
  totalCompleted: number;
  totalPassed: number;
  minutesToCompletion: number[];
  minutesToPass: number[];
}
