import { WeeklyProgressStatistics } from "../weekly-progress/model/weekly-summary.model";

export interface WeeklyFeedback {
    id?: number;
    courseId?: number;
    learnerId?: number;

    instructorId?: number;
    instructorName?: string;
    weekEnd: Date;
    semaphore: number;
    semaphoreJustification: string;
    opinions?: FeedbackOpinion[];

    averageSatisfaction?: number;
    reflectionIds?: number[];
    achievedTaskPoints?: number;
    maxTaskPoints?: number;
    
    achievedPercentage?: number;
}

export interface FeedbackOpinion {
    code: string;
    label?: string;
    value: number;
}

export function createOpinions(r: WeeklyProgressStatistics): FeedbackOpinion[] {
    if(!r) return null;
    const completedItems = r.satisfiedKcCount + r.completedTaskCount + r.gradedTaskCount;
    const totalItems = r.totalKcCount + r.totalTaskCount;
    const completedRatio = 100 * (completedItems / totalItems);
    const negativePatternCount = r.negativePatterns.reduce((s, pattern) => s + pattern.count, 0);

    let learningOpinion = 2;
    if(completedRatio < 40) learningOpinion = 0;
    else if(negativePatternCount > 0.75 * completedItems) learningOpinion = 0;
    else if(negativePatternCount > 0.4 * completedItems) learningOpinion = 1;

    let effortOpinion = 0;
    if(40 < completedRatio && completedRatio < 75) effortOpinion = 2;
    if(completedRatio >= 75) effortOpinion = 3;

    let tasksOpinion = 1;
    if(40 < r.percentPoints && r.percentPoints < 75) tasksOpinion = 2;
    if(r.percentPoints >= 75) tasksOpinion = 3;

    return [
      { code: 't-learning', value: learningOpinion },
      { code: 't-effort', value: effortOpinion },
      { code: 't-tasks', value: tasksOpinion }
    ]
}