import { UnitRatingStatistics, UnitProgressRating } from "./rating.model";
import { KcSummaryStatistics, TaskSummaryStatistics } from "./unit-statistics.model";

export interface UnitHeader {
    id: number;
    name: string;
    order: number;
    tasks: TaskHeader[];
    
    rating?: UnitRatingStatistics;

    kcStatistics?: KcSummaryStatistics;
    taskStatistics?: TaskSummaryStatistics;
}

export interface TaskHeader {
    id: number;
    name: string;
    order: number;
    maxPoints: number;

    learnerPoints?: number;
    rating?: UnitProgressRating;
}

export function initializeUnit(unit: UnitHeader) {
    unit.rating = { avgKcGroupSatisfaction: 0, avgKcSatisfaction: 0, kcSatisfactionCount: 0, kcGroupSatisfactionCount: 0, ratings: [] };
}