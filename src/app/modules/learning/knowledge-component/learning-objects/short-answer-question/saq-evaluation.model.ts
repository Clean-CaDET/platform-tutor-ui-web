export class SaqEvaluation {
  acceptableAnswers: string[];
  correctnessLevel: number;

  constructor(obj?: any) {
    if (obj) {
      this.acceptableAnswers = obj.acceptableAnswers;
      this.correctnessLevel = obj.correctnessLevel;
    }
  }
}
