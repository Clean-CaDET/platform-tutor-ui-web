/**
 * Incremental parser for a stream of whitespace- or comma-separated JSON string literals.
 * The parser is chunk-safe: callers may feed the input via `push()` in arbitrary slices
 * (as delivered by a network `ReadableStream`), and each time a complete JSON string
 * literal is recognised, the decoded value is handed to the `onElement` callback.
 */
export class StreamingJsonStringsParser {
  /**
   * Current position in the state machine.
   * - `outside`: scanning for the next opening `"` of a string literal.
   * - `in-string`: between an opening `"` and its matching closing `"`.
   */
  private phase: 'outside' | 'in-string' = 'outside';

  /**
   * Unconsumed bytes carried over between `push()` calls. Grows with each chunk and
   * shrinks each time a complete literal is emitted.
   */
  private buffer = '';

  /**
   * Offset inside `buffer` at which the `in-string` scan should resume. Starts at `1`
   * because index `0` is always the opening quote of the current literal (we never
   * reinterpret the opening quote as a terminator).
   */
  private scanPos = 1;

  /**
   * True when the previous character inside a string was an unescaped backslash, meaning
   * the next character is a literal and must not be interpreted as `"` or `\`.
   * This flag persists across `push()` calls so a chunk boundary falling between a
   * backslash and the escaped character does not confuse the scanner.
   */
  private isEscaped = false;

  /**
   * @param onElement Callback invoked once per fully decoded string literal.
   *                  Receives the unescaped JavaScript string (e.g. `"\\n"` arrives as `"\n"`).
   */
  constructor(private readonly onElement: (value: string) => void) { }

  /**
   * Append the next chunk of raw text to the internal buffer and emit any string literals
   * that have now become complete. Safe to call with partial, empty, or multi-literal chunks.
   */
  push(chunk: string): void {
    this.buffer += chunk;
    this.scan();
  }

  /**
   * Core state-machine loop. Alternates between:
   *   1. Skipping "outside" bytes (whitespace, brackets, commas) until the next `"`.
   *   2. Walking through an "in-string" region honouring backslash escapes until the
   *      matching closing `"` is found, at which point the whole literal is handed to
   *      `JSON.parse` for canonical unescaping and then emitted.
   *
   * If the buffer is exhausted mid-literal, the method returns while preserving
   * `scanPos` and `isEscaped`, so the next `push()` resumes scanning exactly where
   * this one stopped — no re-scanning of already-examined characters.
   */
  private scan(): void {
    while (true) {
      if (this.phase === 'outside') {
        // Fast-forward past any noise (whitespace, `[`, `]`, `,`, etc.) until we find the
        // next opening quote. If none is found, discard the noise and wait for more data.
        let i = 0;
        while (i < this.buffer.length && this.buffer[i] !== '"') i++;
        if (i >= this.buffer.length) { this.buffer = ''; return; }
        this.buffer = this.buffer.slice(i);
        this.scanPos = 1;
        this.phase = 'in-string';
      }

      // `completed` flips to true when we consume a full "..." literal and need to re-enter the outer loop.
      let completed = false;
      while (this.scanPos < this.buffer.length) {
        const c = this.buffer[this.scanPos];
        if (this.isEscaped) {
          // Previous char was `\` — whatever this character is, it is part of the
          // escape sequence and must not be interpreted as a delimiter.
          this.isEscaped = false;
          this.scanPos++;
          continue;
        }
        if (c === '\\') {
          // Begin an escape sequence; defer interpretation to the next iteration so
          // this works correctly even if the escaped character has not arrived yet.
          this.isEscaped = true;
          this.scanPos++;
          continue;
        }
        if (c === '"') {
          // Unescaped closing quote. Slice the whole literal (including both quotes)
          // and let `JSON.parse` handle `\n`, `\uXXXX`, surrogate pairs, etc. for us.
          const lit = this.buffer.slice(0, this.scanPos + 1);
          const value = JSON.parse(lit) as string;
          this.onElement(value);
          this.buffer = this.buffer.slice(this.scanPos + 1);
          this.scanPos = 1;
          this.phase = 'outside';
          completed = true;
          break;
        }
        this.scanPos++;
      }
      // Ran out of buffer without closing the string — suspend and wait for more input.
      if (!completed) return;
    }
  }
}
