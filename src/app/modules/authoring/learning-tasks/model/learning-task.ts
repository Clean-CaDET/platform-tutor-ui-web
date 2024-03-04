import { TaskStep } from "./task-step";

export interface LearningTask {
    id?: number;
    unitId?: number;
    name: string;
    description?: string;
    isTemplate: boolean;
    steps?: TaskStep[];
    maxPoints?: number;
}