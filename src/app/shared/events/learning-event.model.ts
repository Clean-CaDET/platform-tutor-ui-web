export class LearningEvent {
  type: string;
  timeStamp: Date;
  knowledgeComponentId: number;
  learnerId: number;
  specificData: string | undefined;

  constructor(event: Record<string, unknown>) {
    this.type = event['$discriminator'] as string;
    this.timeStamp = new Date(event['TimeStamp'] as string);
    this.knowledgeComponentId = event['KnowledgeComponentId'] as number;
    this.learnerId = event['LearnerId'] as number;

    const data = { ...event };
    delete data['$discriminator'];
    delete data['TimeStamp'];
    delete data['KnowledgeComponentId'];
    delete data['LearnerId'];
    if (Object.keys(data).length > 0) {
      this.specificData = JSON.stringify(data);
    }
  }
}
