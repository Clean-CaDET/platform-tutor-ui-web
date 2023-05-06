import { CreateLearner } from "./create-learner.model";

export interface BulkAccounts {
  existingAccounts: CreateLearner[];
  newAccounts: CreateLearner[];
}
