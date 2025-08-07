import { ActivityExample } from "./activity-example";
import { Standard } from "./standard";
import { SubmissionFormat } from "./submission-format";

export interface Activity {
    id?: number;
    parentId?: number;
    order: number;
    code: string;
    name: string;
    
    guidance: string;
    examples?: ActivityExample[];
    hasLlmSupport?: boolean;
    llmAdditionalInstructions?: string;
    
    submissionFormat: SubmissionFormat
    shouldBeGraded?: boolean;
    standards?: Standard[];
    maxPoints?: number;

    subactivities?: Activity[];
}