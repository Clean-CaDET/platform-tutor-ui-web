export class KCMastery {
  mastery: number;

  constructor(obj?: any) {
    if (obj) {
      this.mastery = Math.round(obj.mastery * 100) / 100;
    }
  }
}
