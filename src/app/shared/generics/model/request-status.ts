import { RequestStatus } from "../../model/request-status.model";

export function isRequestStartedOrError(changes: { currentValue: RequestStatus; previousValue: RequestStatus }): boolean {
  if (!changes) return false;
  if (changes.currentValue === changes.previousValue) return false;
  return changes.currentValue === RequestStatus.Started || changes.currentValue === RequestStatus.Error;
}
