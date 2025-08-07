import { ActivityExample } from "./activity-example";
import { Standard } from "./standard";
import { StepProgress } from "./step-progress";
import { SubmissionFormat } from "./submission-format";

export interface Activity {
    id?: number;
    parentId?: number;
    order: number;
    code: string;
    name: string;

    hasLlmSupport: boolean;
    guidance: string;
    examples?: ActivityExample[];

    submissionFormat: SubmissionFormat
    standards?: Standard[];
    maxPoints?: number;

    subactivities?: Activity[];
    progress: StepProgress;
}