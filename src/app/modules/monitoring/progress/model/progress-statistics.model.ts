export interface WeeklyGradeStatistics {
    learnerPoints: number;
    avgGroupPoints: number; // sum(totalCount*avgGroup) / sum(totalCount)
}

export interface KcProgressStatistics {
    totalCount: number;
    satisfiedCount: number;

    negativeInstructionalPatterns: string[];
    negativeAssessmentPatterns: string[];
}

export interface TaskProgressStatistics {
    totalCount: number;
    completedCount: number;

    learnerPoints: number;
    avgGroupPoints: number;

    negativePatterns: string[];
}

export interface UnitProgressStatistics {
    unitId: number;
    kcStatistics: KcProgressStatistics;
    taskStatistics: TaskProgressStatistics;
    taskPoints: {
        taskId: number,
        wonPoints: number
    }[];
}