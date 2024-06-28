import { Enrollment } from "./enrollment.model";

export interface Unit {
  id: number;
  courseId: number;
  code: string;
  name: string;
  order: number;
  enrollments: Enrollment[];
  groupEnrollment: Enrollment
}