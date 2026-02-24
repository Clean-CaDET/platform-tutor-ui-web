import { Component, ChangeDetectionStrategy, OnDestroy, AfterViewInit, input, output, model, signal, viewChild, ElementRef, effect, linkedSignal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MarkdownComponent } from 'ngx-markdown';

@Component({
  selector: 'cc-markdown-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule,
    MatButtonModule, MatMenuModule, MatDividerModule, MatTooltipModule, MarkdownComponent,
  ],
  templateUrl: './markdown-editor.component.html',
  styleUrl: './markdown-editor.component.scss',
})
export class MarkdownEditorComponent implements AfterViewInit, OnDestroy {
  readonly label = input('');
  readonly authoring = input(true);
  readonly submitCtrls = input(false);
  readonly indextab = input(50);
  readonly sidePreview = input(false);

  readonly text = model('');
  readonly submit = output<string | undefined>();

  readonly textAreaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textAreaElement');
  readonly markdownContainerRef = viewChild<ElementRef<HTMLElement>>('markdownContainerElement');

  readonly textControl = new FormControl('', { nonNullable: true });
  readonly livePreview = signal(true);
  readonly synchEnabled = linkedSignal(() => this.sidePreview());

  private scrollAbortController: AbortController | null = null;

  constructor() {
    // Sync text model → form control (when parent updates text)
    effect(() => {
      const value = this.text();
      if (this.textControl.value !== value) {
        this.textControl.setValue(value, { emitEvent: false });
      }
    });

    // Sync form control → text model (when user types)
    this.textControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
      this.text.set(value);
    });
  }

  ngAfterViewInit(): void {
    this.setupScrollSync();
  }

  ngOnDestroy(): void {
    this.scrollAbortController?.abort();
  }

  togglePreview(): void {
    this.livePreview.update(v => !v);
    this.setupScrollSync();
  }

  setupScrollSync(): void {
    this.scrollAbortController?.abort();
    if (!this.sidePreview() || !this.livePreview()) return;

    this.scrollAbortController = new AbortController();
    const abortSignal = this.scrollAbortController.signal;

    setTimeout(() => {
      const textArea = this.textAreaRef()?.nativeElement;
      const markdownContainer = this.markdownContainerRef()?.nativeElement;
      if (!textArea || !markdownContainer) return;

      const syncScroll = (source: HTMLElement, target: HTMLElement) => {
        const sourceRatio = source.scrollTop / (source.scrollHeight - source.clientHeight);
        const targetScrollTop = sourceRatio * (target.scrollHeight - target.clientHeight);
        if (Math.abs(target.scrollTop - targetScrollTop) > 1) {
          target.scrollTop = targetScrollTop;
        }
      };

      let isSyncing = false;
      const handleScroll = (source: HTMLElement, target: HTMLElement) => {
        if (isSyncing || !this.synchEnabled()) return;
        isSyncing = true;
        syncScroll(source, target);
        setTimeout(() => { isSyncing = false; }, 50);
      };

      textArea.addEventListener('scroll', () => handleScroll(textArea, markdownContainer), { signal: abortSignal });
      markdownContainer.addEventListener('scroll', () => handleScroll(markdownContainer, textArea), { signal: abortSignal });
    }, 100);
  }

  insertElement(type: string): void {
    let tagBegin = '';
    let tagEnd = '';
    let tagText = '';
    switch (type) {
      case 'bold':
        tagBegin = tagEnd = '**';
        tagText = 'Bold Text';
        break;
      case 'italic':
        tagBegin = tagEnd = '_';
        tagText = 'Italic Text';
        break;
      case 'code':
        tagBegin = '```\n';
        tagEnd = '\n```';
        tagText = 'Code';
        break;
      case 'link':
        tagBegin = '<a href="URL" target="_blank">';
        tagEnd = '</a>';
        tagText = 'Text';
        break;
      case 'hidden':
        tagBegin = '\n<hr></hr>\n<details>\n<summary><b>Kliknite da vidite rešenje</b></summary>\n\n';
        tagEnd = '\n\n</details>\n<hr></hr>\n';
        tagText = 'Hidden until clicked';
        break;
      case 'h1':
        tagBegin = '# ';
        tagText = 'Heading 1';
        break;
      case 'h2':
        tagBegin = '## ';
        tagText = 'Heading 2';
        break;
      case 'h3':
        tagBegin = '### ';
        tagText = 'Heading 3';
        break;
    }

    const textArea = this.textAreaRef()?.nativeElement;
    if (textArea && textArea.selectionStart !== textArea.selectionEnd) {
      tagText = this.textControl.value.slice(textArea.selectionStart, textArea.selectionEnd);
    }
    const insertText = tagBegin + tagText + tagEnd;

    let selectionStart: number;
    const currentValue = this.textControl.value;
    if (textArea) {
      const newValue = currentValue.slice(0, textArea.selectionStart) + insertText + currentValue.slice(textArea.selectionEnd);
      selectionStart = textArea.selectionStart + tagBegin.length;
      this.textControl.setValue(newValue);
    } else {
      selectionStart = currentValue.length + tagBegin.length;
      this.textControl.setValue(currentValue + insertText);
    }

    setTimeout(() => {
      const ta = this.textAreaRef()?.nativeElement;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(selectionStart, selectionStart + tagText.length);

      const lineHeight = parseInt(window.getComputedStyle(ta).lineHeight, 10);
      const textBeforeSelection = ta.value.slice(0, selectionStart);
      const linesBeforeSelection = (textBeforeSelection.match(/\n/g) || []).length;
      const scrollPosition = linesBeforeSelection * lineHeight;
      ta.scrollTop = Math.min(scrollPosition, ta.scrollHeight - ta.clientHeight);
    });
  }

  onSubmit(isDiscard: boolean): void {
    if (isDiscard) this.submit.emit(undefined);
    else this.submit.emit(this.textControl.value);
  }
}
