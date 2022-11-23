export class KnowledgeComponentStatistics {
  mastery: number;
  totalCount: number;
  passedCount: number;
  attemptedCount: number;
  isSatisfied: boolean;

  constructor(obj?: any) {
    if (obj) {
      this.mastery = obj.mastery;
      this.totalCount = obj.totalCount;
      this.passedCount = obj.passedCount;
      this.attemptedCount = obj.attemptedCount;
      this.isSatisfied = obj.isSatisfied;
    }
  }
}
