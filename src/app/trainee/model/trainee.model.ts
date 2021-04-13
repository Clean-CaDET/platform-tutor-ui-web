export class Trainee {
  id: number;
  studentIndex: string;
  visualScore: number;
  auralScore: number;
  readWriteScore: number;
  kinaestheticScore: number;

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.studentIndex = obj.studentIndex;
      this.visualScore = obj.visualScore;
      this.auralScore = obj.auralScore;
      this.readWriteScore = obj.readWriteScore;
      this.kinaestheticScore = obj.kinaestheticScore;
    }
  }
}
