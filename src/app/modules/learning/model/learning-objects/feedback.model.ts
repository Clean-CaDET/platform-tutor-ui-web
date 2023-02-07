import { Evaluation } from "./evaluation.model";

export interface Feedback {
    type: string;
    hint: string;
    evaluation: Evaluation;
}

export const feedbackTypes = {
    pump: 'Pump',
    hint: 'Hint',
    correctness: 'Correctness',
    solution: 'Solution',
};
