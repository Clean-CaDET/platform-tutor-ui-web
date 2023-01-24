import {Learner} from '../../knowledge-analytics/model/learner.model';
import {KnowledgeComponentProgress} from './knowledge-component-progress.model';

export interface LearnerProgress {
  learner: Learner;
  knowledgeComponentProgress: KnowledgeComponentProgress[];
}
