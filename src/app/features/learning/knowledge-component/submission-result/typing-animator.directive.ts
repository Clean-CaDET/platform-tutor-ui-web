import { Directive, ElementRef, input, inject, effect, OnDestroy } from '@angular/core';
import { Subscription, interval, concat, of, delay, tap } from 'rxjs';
import { map, take } from 'rxjs/operators';

const STYLE_ID = 'typing-animator-style';
let styleRefCount = 0;

@Directive({
  selector: '[ccTypingAnimator]',
})
export class TypingAnimatorDirective implements OnDestroy {
  private readonly el = inject(ElementRef);

  readonly sentences = input<string[]>([], { alias: 'ccTypingAnimator' });
  readonly typeSpeed = input(50);

  private typingSub?: Subscription;

  constructor() {
    addStyleRef();
    effect(() => {
      const msgs = this.sentences();
      if (msgs.length) this.startTyping(msgs);
    });
  }

  ngOnDestroy(): void {
    this.typingSub?.unsubscribe();
    removeStyleRef();
  }

  private startTyping(sentences: string[]): void {
    this.typingSub?.unsubscribe();

    const el = this.el.nativeElement as HTMLElement;
    el.textContent = '';
    el.classList.add('typing');

    const typeWord = (word: string) =>
      interval(this.typeSpeed()).pipe(
        take(word.length),
        map(i => word.substring(0, i + 1)),
        tap(text => {
          el.textContent = text;
        }),
      );

    const observables = sentences.map(sentence =>
      concat(
        typeWord(sentence),
        of(null).pipe(
          delay(1200),
          tap(() => { el.textContent = sentence; }),
        ),
      ),
    );

    this.typingSub = concat(...observables).subscribe({
      complete: () => el.classList.remove('typing'),
    });
  }
}

function addStyleRef(): void {
  styleRefCount++;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    .typing::after {
      content: '|';
      opacity: 1;
      animation: typedBlink 0.7s infinite;
    }
    @keyframes typedBlink {
      50% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

function removeStyleRef(): void {
  if (--styleRefCount <= 0) {
    styleRefCount = 0;
    document.getElementById(STYLE_ID)?.remove();
  }
}
