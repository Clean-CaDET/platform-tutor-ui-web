export interface UnitItem {
  id: number;
  unitId: number;
  name: number;
  order: number;
  type: UnitItemType;
}

export enum UnitItemType {
    Kc = 1,
    Task
}