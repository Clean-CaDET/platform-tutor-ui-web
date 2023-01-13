import { Type } from '@angular/core';
import { LearningObjectComponent } from './learning-object-component';

export abstract class LearningObject {
  id?: number;
  knowledgeComponentId: number;
  typeDiscriminator: string;
  order: number;

  protected constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.knowledgeComponentId = obj.knowledgeComponentId;
      this.typeDiscriminator = obj.typeDiscriminator;
      this.order = obj.order;
    }
  }

  abstract getComponent(): Type<LearningObjectComponent>;

}
