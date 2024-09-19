export interface WeeklyFeedback {
    id?: number;
    courseId?: number;
    learnerId?: number;

    instructorId?: number;
    instructorName?: string;
    weekEnd: Date;
    semaphore: number;
    semaphoreJustification: string;

    averageSatisfaction: number;
    achievedTaskPoints: number;
    maxTaskPoints: number;
}