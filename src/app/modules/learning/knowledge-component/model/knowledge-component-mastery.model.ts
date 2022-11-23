export class KCMastery {
  mastery: number;
  isSatisfied: boolean;

  constructor(obj?: any) {
    if (obj) {
      this.mastery = obj.mastery;
      this.isSatisfied = obj.isSatisfied;
    }
  }
}
