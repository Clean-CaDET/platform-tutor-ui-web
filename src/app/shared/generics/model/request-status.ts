export enum RequestStatus {
  None = 0,
  Started = 1,
  Completed = 2,
  Error = 3,
}

export function isRequestStartedOrError(changes: { currentValue: RequestStatus; previousValue: RequestStatus }): boolean {
  if (!changes) return false;
  if (changes.currentValue === changes.previousValue) return false;
  return changes.currentValue === RequestStatus.Started || changes.currentValue === RequestStatus.Error;
}
