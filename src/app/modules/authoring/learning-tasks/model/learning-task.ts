import { Activity } from "./activity";

export interface LearningTask {
    id?: number;
    unitId?: number;
    name: string;
    description?: string;
    order?: number;
    isTemplate: boolean;
    steps?: Activity[];
    maxPoints?: number;
}