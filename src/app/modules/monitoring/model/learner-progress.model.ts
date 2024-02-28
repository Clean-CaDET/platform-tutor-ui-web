import {Learner} from './learner.model';
import {KnowledgeComponentProgress} from './knowledge-component-progress.model';

export interface LearnerProgress {
  learner: Learner;
  knowledgeComponentProgress: KnowledgeComponentProgress[];
  kcCount: number;
  satisfiedCount: number;
  suspiciousCount: number;
  performance: string;
}
