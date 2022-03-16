export class KCMastery {
  mastery: number;

  constructor(obj?: any) {
    if (obj) {
      this.mastery = obj.mastery.toFixed(2);
    }
  }
}
