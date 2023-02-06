import { Evaluation } from "./evaluation.model";

export interface Feedback {
    type: string;
    hint: string;
    evaluation: Evaluation;
}

export const feedbackTypes = {
    pump: 'pump',
    hint: 'hint',
    correctness: 'correctness',
    solution: 'solution',
};
