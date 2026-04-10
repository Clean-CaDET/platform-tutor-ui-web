export interface ElaborationTask {
  id?: number;
  conceptRecordId: number;
  unitId?: number;
  expectedLevel: string;
  order: number;
  conceptRecordTitle?: string;
}
