import { Standard } from "./strandard";
import { SubmissionFormat } from "./submission-format";

export interface Step {
    id?: number;
    parentId?: number;
    order: number;
    code: string;
    name: string;
    submissionFormat: SubmissionFormat;
    standards?: Standard[];
}