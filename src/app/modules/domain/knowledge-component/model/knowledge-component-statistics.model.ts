export class KnowledgeComponentStatistics {
  mastery: number;
  numberOfAssessmentEvents: number;
  numberOfCompletedAssessmentEvents: number;
  numberOfTriedAssessmentEvents: number;
  isSatisfied: boolean;

  constructor(obj?: any) {
    if (obj) {
      this.mastery = obj.mastery;
      this.numberOfAssessmentEvents = obj.numberOfAssessmentEvents;
      this.numberOfCompletedAssessmentEvents = obj.numberOfCompletedAssessmentEvents;
      this.numberOfTriedAssessmentEvents = obj.numberOfTriedAssessmentEvents;
      this.isSatisfied = obj.isSatisfied;
    }
  }
}
