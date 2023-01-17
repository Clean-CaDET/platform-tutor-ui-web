export abstract class AssessmentItem {
    id?: number;
    knowledgeComponentId: number;
    typeDiscriminator: string;
    text: string;
    order: number;
  
    protected constructor(obj?: any) {
      if (obj) {
        this.id = obj.id;
        this.knowledgeComponentId = obj.knowledgeComponentId;
        this.typeDiscriminator = obj.typeDiscriminator;
        this.text = obj.text;
        this.order = obj.order;
      }
    }
}