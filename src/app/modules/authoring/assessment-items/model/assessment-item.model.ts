export class AssessmentItem {
    $type: string;
    id?: number;
    knowledgeComponentId: number;
    text: string;
    order: number;
    hints: string[];

    constructor(obj?: any) {
      if (obj) {
        this.$type = obj.$type;
        this.id = obj.id;
        this.knowledgeComponentId = obj.knowledgeComponentId;
        this.text = obj.text;
        this.order = obj.order;
        this.hints = obj.hints;
      }
    }
}
