export interface UnitItem {
  id: number;
  unitId: number;
  name: string;
  description: string;
  order: number;
  type: UnitItemType;
}

export enum UnitItemType {
    Kc = 1,
    Task
}