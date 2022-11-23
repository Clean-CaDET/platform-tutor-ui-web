export class McqEvaluation {
  correctAnswer: string;
  feedback: string
  correctnessLevel: number;

  constructor(obj?: any) {
    if (obj) {
      this.feedback = obj.feedback;
      this.correctAnswer = obj.correctAnswer;
      this.correctnessLevel = obj.correctnessLevel;
    }
  }
}
