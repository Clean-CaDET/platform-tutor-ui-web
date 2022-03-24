export class KnowledgeComponentStatistics {
  mastery: number;
  totalCount: number;
  completedCount: number;
  attemptedCount: number;
  isSatisfied: boolean;

  constructor(obj?: any) {
    if (obj) {
      this.mastery = obj.mastery;
      this.totalCount = obj.numberOfAssessmentEvents;
      this.completedCount = obj.numberOfCompletedAssessmentEvents;
      this.attemptedCount = obj.numberOfTriedAssessmentEvents;
      this.isSatisfied = obj.isSatisfied;
    }
  }
}
