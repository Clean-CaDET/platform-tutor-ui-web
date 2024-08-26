export enum RequestStatus {
  None = 0,
  Started = 1,
  Completed = 2,
  Error = 3
}

export function isRequestStartedOrError(changes: {currentValue: RequestStatus, previousValue: RequestStatus}) {
  if(!changes) return false;
  if(changes.currentValue === changes.previousValue) return false; // Change was triggered by another field
  return changes.currentValue === RequestStatus.Started || changes.currentValue === RequestStatus.Error;
}