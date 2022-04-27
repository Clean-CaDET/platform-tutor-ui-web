export class LearningEvent {
    type: string;
    timeStamp: Date;
    knowledgeComponentId: number;
    learnerId: number;
    specificData: any;

    constructor(event?: any) {
        this.type = event['$discriminator'];
        this.timeStamp = new Date(event['timeStamp']);
        this.knowledgeComponentId = event['knowledgeComponentId'];
        this.learnerId = event['learnerId'];

        this.specificData = event;
        delete this.specificData['$discriminator'];
        delete this.specificData['timeStamp'];
        delete this.specificData['knowledgeComponentId'];
        delete this.specificData['learnerId'];
        if(Object.keys(this.specificData).length == 0) delete this.specificData;
    }
}