import { TaskHeader } from "./unit-header.model";

export interface WeeklyGradeStatistics {
    learnerPoints: number;
    avgGroupPoints: number; // sum(totalCount*avgGroup) / sum(totalCount)
}

export interface KcSummaryStatistics {
    totalCount: number;
    satisfiedCount: number;

    negativeInstructionalPatterns: string[];
    negativeAssessmentPatterns: string[];
}

export interface TaskSummaryStatistics {
    totalCount: number;
    completedCount: number;

    learnerPoints: number;
    avgGroupPoints: number;

    negativePatterns: string[];
}

export interface UnitSummaryStatistics {
    unitId: number;
    kcStatistics: KcSummaryStatistics;
    taskStatistics: TaskSummaryStatistics;
    taskPoints: {
        taskId: number,
        wonPoints: number
    }[];
}