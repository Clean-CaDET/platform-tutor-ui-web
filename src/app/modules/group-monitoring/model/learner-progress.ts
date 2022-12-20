import {Learner} from '../../knowledge-analytics/model/learner';
import {KnowledgeComponentProgress} from './knowledge-component-progress';

export interface LearnerProgress {
  learner: Learner;
  knowledgeComponentProgress: KnowledgeComponentProgress[];
}
