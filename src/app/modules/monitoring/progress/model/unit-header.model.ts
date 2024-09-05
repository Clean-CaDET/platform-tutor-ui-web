import { UnitRatingStatistics, UnitProgressRating } from "./rating.model";
import { KcProgressStatistics, TaskProgressStatistics } from "./progress-statistics.model";

export interface UnitHeader {
    id: number;
    name: string;
    order: number;
    tasks: TaskHeader[];
    
    rating?: UnitRatingStatistics;

    kcStatistics?: KcProgressStatistics;
    taskStatistics?: TaskProgressStatistics;
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