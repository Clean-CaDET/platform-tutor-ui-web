import { Standard } from "./strandard";
import { SubmissionFormat } from "./submission-format";

export interface Step {
    id?: number;
    order: number;
    code: string;
    name: string;    
    submissionFormat: SubmissionFormat;
    standards?: Standard[];
}