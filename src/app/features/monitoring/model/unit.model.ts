import { Enrollment } from './enrollment.model';

export interface MonitoringUnit {
  id: number;
  courseId: number;
  code: string;
  name: string;
  order: number;
  enrollments: Enrollment[];
  groupEnrollment: Enrollment;
}
