import { Type } from '@angular/core';
import { LearningObjectComponent } from './learning-object-component';

export abstract class LearningObject {
  id?: number;
  knowledgeComponentId: number;
  $type: string;
  order: number;

  protected constructor(obj?: any) {
    if (obj) {
      this.$type = obj.$type;
      this.id = obj.id;
      this.knowledgeComponentId = obj.knowledgeComponentId;
      this.order = obj.order;
    }
  }

  abstract getComponent(): Type<LearningObjectComponent>;

}
