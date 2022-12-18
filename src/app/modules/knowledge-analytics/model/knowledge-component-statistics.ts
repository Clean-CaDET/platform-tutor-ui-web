export interface KnowledgeComponentStatistics {
  kcCode: string;
  kcName: string;
  totalRegistered: number;
  totalStarted: number;
  totalCompleted: number;
  totalPassed: number;
  minutesToCompletion: number[];
  minutesToPass: number[];
}
