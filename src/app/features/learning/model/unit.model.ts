export interface Unit {
  id?: number;
  code: string;
  name: string;
  introduction?: string;
  goals: string;
  guidelines?: string;
  order: number;
  bestBefore?: Date;
  enrollmentStatus?: string;
}
