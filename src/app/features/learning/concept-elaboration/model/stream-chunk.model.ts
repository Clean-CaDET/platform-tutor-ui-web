import { AttemptStatus } from './attempt-status.model';

export type StreamChunk =
  | { kind: 'text'; value: string }
  | { kind: 'metadata'; attemptId: number; status: AttemptStatus; summary: string | null }
  | { kind: 'error'; code: number; message: string; attemptId?: number };
