import { Activity } from "./activity";

export interface LearningTask {
    id?: number;
    unitId?: number;
    name: string;
    description?: string;
    isTemplate: boolean;
    steps?: Activity[];
    maxPoints?: number;
}