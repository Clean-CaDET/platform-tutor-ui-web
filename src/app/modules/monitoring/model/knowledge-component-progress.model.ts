import {KcMasteryStatistics} from './kc-mastery-statistics.model';
import {AssessmentItemMastery} from './assessment-item-mastery.model';

export interface KnowledgeComponentProgress {
  learnerId: number;
  knowledgeComponentId: number;
  statistics: KcMasteryStatistics;
  assessmentItemMasteries: AssessmentItemMastery[];
  activeSessionInMinutes: number;
  isSuspicious: boolean;
}
