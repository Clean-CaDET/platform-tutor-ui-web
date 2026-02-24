export interface Course {
  id?: number;
  code: string;
  name: string;
  isArchived?: boolean;
  description: string;
  startDate: Date;
}
