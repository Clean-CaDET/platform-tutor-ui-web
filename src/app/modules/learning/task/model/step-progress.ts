import { StandardEvaluation } from "./standard-evaluation";

export interface StepProgress {
    id?: number;
    answer: string;
    commentForMentor?: string;
    status: string;
    stepId: number;
    evaluations?: StandardEvaluation[];
    comment?: string;
}