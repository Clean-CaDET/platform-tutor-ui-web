export class KnowledgeComponentStatistics {
  mastery: number;
  totalCount: number;
  completedCount: number;
  attemptedCount: number;
  isSatisfied: boolean;

  constructor(obj?: any) {
    if (obj) {
      this.mastery = obj.mastery;
      this.totalCount = obj.totalCount;
      this.completedCount = obj.completedCount;
      this.attemptedCount = obj.attemptedCount;
      this.isSatisfied = obj.isSatisfied;
    }
  }
}
