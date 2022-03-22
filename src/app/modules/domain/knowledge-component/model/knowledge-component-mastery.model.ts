export class KCMastery {
  mastery: number;
  isSatisfied: boolean;

  constructor(obj?: any) {
    if (obj) {
      this.mastery = obj.mastery.toFixed(2);
      this.isSatisfied = obj.isSatisfied;
    }
  }
}
