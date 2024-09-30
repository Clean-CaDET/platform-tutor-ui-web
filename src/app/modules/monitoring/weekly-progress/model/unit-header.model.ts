import { UnitProgressRating } from "./unit-rating.model";
import { KcProgressStatistics, KcStatistics, TaskProgressStatistics, TaskStatistics } from "./unit-statistics.model";

export interface UnitHeader {
    id: number;
    name: string;
    order: number;
    bestBefore: Date;
    knowledgeComponents: KcHeader[];
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
    unit.knowledgeComponents?.forEach(kc => {
        if(!kc.statistics?.satisfactionTime) return;
        unit.timelineItems.push({ type:"kc", item: kc, time: new Date(kc.statistics.satisfactionTime) });
    });
    unit.tasks?.forEach(t => {
        if(!t.statistics?.completionTime) return;
        unit.timelineItems.push({ type:"task", item: t, time: new Date(t.statistics.completionTime) });
    });
    unit.ratings?.forEach(r => {
        unit.timelineItems.push({ type:"rating", item: r, time: new Date(r.created) });
    });
    unit.timelineItems.sort((a, b) => a.time.getTime() - b.time.getTime());
}