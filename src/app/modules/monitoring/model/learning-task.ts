import { Step } from "./step";

export interface LearningTask {
    id: number;
    unitId: number;
    name: string;
    description?: string;
    order: number;
    steps: Step[];
}