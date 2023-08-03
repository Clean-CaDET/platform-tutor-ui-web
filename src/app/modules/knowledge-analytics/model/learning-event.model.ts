export class LearningEvent {
  type: string;
  timeStamp: Date;
  knowledgeComponentId: number;
  learnerId: number;
  specificData: any;

  constructor(event?: any) {
    this.type = event['$discriminator'];
    this.timeStamp = new Date(event['TimeStamp']);
    this.knowledgeComponentId = event['KnowledgeComponentId'];
    this.learnerId = event['LearnerId'];

    this.specificData = event;
    delete this.specificData['$discriminator'];
    delete this.specificData['TimeStamp'];
    delete this.specificData['KnowledgeComponentId'];
    delete this.specificData['LearnerId'];
    if (Object.keys(this.specificData).length === 0) delete this.specificData;
  }
}
