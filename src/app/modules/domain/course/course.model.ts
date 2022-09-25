import {Unit} from '../unit/unit.model';

export class Course {
  id: number;
  name: string;
  units: Unit[];

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.name = obj.name;
      this.units = obj.knowledgeUnits.map(ku => new Unit(ku));
    }
  }
}
