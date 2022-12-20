import {KcMasteryStatistics} from './kc-mastery-statistics';
import {AssessmentItemMastery} from './assessment-item-mastery';

export interface KnowledgeComponentProgress {
  knowledgeComponentId: number;
  statistics: KcMasteryStatistics;
  assessmentItemMasteries: AssessmentItemMastery[];
  durationOfFinishedSessionsInMinutes: number;
}
