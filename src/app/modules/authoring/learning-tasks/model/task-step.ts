import { Standard } from "./standard";
import { SubmissionFormat } from "./submission-format";

export interface TaskStep {
    id?: number;
    order: number;
    activityId: number;
    activityName: string;
    submissionFormat?: SubmissionFormat;
    standards?: Standard[];
    maxPoints?: number;
}

