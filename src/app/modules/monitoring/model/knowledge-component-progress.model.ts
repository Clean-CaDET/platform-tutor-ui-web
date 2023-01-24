import {KcMasteryStatistics} from './kc-mastery-statistics.model';
import {AssessmentItemMastery} from './assessment-item-mastery.model';

export interface KnowledgeComponentProgress {
  knowledgeComponentId: number;
  statistics: KcMasteryStatistics;
  assessmentItemMasteries: AssessmentItemMastery[];
  durationOfAllSessionsInMinutes: number;
}
