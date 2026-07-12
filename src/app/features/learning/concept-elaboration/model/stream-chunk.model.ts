import { AttemptStatus } from './attempt-status.model';

export type StreamChunk =
  | { kind: 'text'; value: string }
  | { kind: 'metadata'; attemptId: number; status: AttemptStatus; finalGrade: number | null }
  | { kind: 'error'; code: number; message: string; attemptId?: number };
