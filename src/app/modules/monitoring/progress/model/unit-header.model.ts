import { UnitProgressRating } from "./rating.model";
import { KcProgressStatistics, KcStatistics, TaskProgressStatistics, TaskStatistics } from "./progress-statistics.model";

export interface UnitHeader {
    id: number;
    name: string;
    order: number;
    bestBefore: Date;
    kcs: KcHeader[];
    tasks: TaskHeader[];
    
    ratings?: UnitProgressRating[];

    kcStatistics?: KcProgressStatistics;
    taskStatistics?: TaskProgressStatistics;

    timelineItems: TimelineItem[];
}

export interface TaskHeader {
    id: number;
    name: string;
    order: number;
    maxPoints: number;

    statistics?: TaskStatistics;
}

export interface KcHeader {
    id: number;
    name: string;
    order: number;

    statistics?: KcStatistics;
}

export interface TimelineItem {
    type: string;
    item: KcHeader | TaskHeader | UnitProgressRating;
    time: Date;
}

export function updateTimelineItems(unit: UnitHeader) {
    unit.timelineItems = [];
    unit.kcs.forEach(kc => {
        if(!kc.statistics?.satisfactionTime) return;
        unit.timelineItems.push({ type:"kc", item: kc, time: kc.statistics.satisfactionTime });
    });
    unit.tasks.forEach(t => {
        if(!t.statistics?.completionTime) return;
        unit.timelineItems.push({ type:"task", item: t, time: t.statistics.completionTime });
    });
    unit.ratings.forEach(r => {
        unit.timelineItems.push({ type:"rating", item: r, time: r.created });
    });
    unit.timelineItems.sort((a, b) => a.time.getTime() - b.time.getTime());
}