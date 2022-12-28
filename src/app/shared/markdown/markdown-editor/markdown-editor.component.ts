import { Component, ViewChild, ElementRef, ChangeDetectorRef, Input, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cc-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.css']
})
export class MarkdownEditorComponent implements OnChanges {
  @Input() label = "";
  @Input() text = "";
  @Input() editMode = false;
  @Input() indextab = 50;
  @Output() textChanged = new EventEmitter<string>();

  livePreview = true;
  selection: any;
  @ViewChild('textAreaElement') textArea: ElementRef<HTMLTextAreaElement>;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnChanges(): void {
    if(this.textArea) {
      this.textArea.nativeElement.focus();
      this.changeDetector.detectChanges();
    }
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
      case 'bulleted':
        tagBegin = '- ';
        tagText = 'List Item';
        break;
      case 'numbered':
        tagBegin = '1. ';
        tagText = 'List Item';
        break;
      case 'code':
        tagBegin = tagEnd = '```';
        tagText = 'Code';
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
    if (this.selection) {
      if (this.selection.selectionStart !== this.selection.selectionEnd) {
        tagText = this.text.slice(
          this.selection.selectionStart,
          this.selection.selectionEnd
        );
      }
    }
    const text = tagBegin + tagText + tagEnd;

    let selectionStart: number;
    if (this.selection) {
      this.text =
        this.text.slice(0, this.selection.selectionStart) +
        text +
        this.text.slice(this.selection.selectionEnd);
      selectionStart = this.selection.selectionStart + tagBegin.length;
    } else {
      selectionStart = this.text.length + tagBegin.length;
      this.text += text;
    }

    // TODO: Usage of setTimeout() should be avoided. Find a better solution.
    setTimeout(() => {
      this.textArea.nativeElement.focus();
      this.textArea.nativeElement.setSelectionRange(
        selectionStart,
        selectionStart + tagText.length
      );
    });
  }

  onSelect(event: Event): void {
    this.selection = event.target;
  }

  onClick(event: Event): void {
    this.selection = event.target;
  }

  onBlur(): void {
    this.textChanged.emit(this.text);
  }
}
