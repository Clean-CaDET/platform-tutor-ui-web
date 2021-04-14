import {
  Component,
  Input,
  ViewChild,
  forwardRef,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'cc-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkdownEditorComponent),
      multi: true
    }
  ]
})
export class MarkdownEditorComponent implements ControlValueAccessor, AfterViewInit {

  text = '';
  livePreview = true;
  selection: any;
  @ViewChild('textAreaElement') textArea: ElementRef<HTMLTextAreaElement>;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.textArea.nativeElement.focus();
    this.changeDetector.detectChanges();
  }

  get value(): string {
    return this.text;
  }

  set value(value: string) {
    this.text = value;
    this.updateChanges();
  }

  updateChanges(): void {
    this.onChange(this.value);
    this.onTouched();
  }

  onChange: any = () => {};

  onTouched: any = () => {};

  writeValue(obj: any): void {
    if (obj) {
      this.value = obj;
    } else {
      this.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.textArea.nativeElement.disabled = isDisabled;
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
        tagText = this.value.slice(this.selection.selectionStart, this.selection.selectionEnd);
      }
    }
    const text = tagBegin + tagText + tagEnd;

    let selectionStart;
    if (this.selection) {
      this.value = this.value.slice(0, this.selection.selectionStart) + text + this.text.slice(this.selection.selectionEnd);
      selectionStart = this.selection.selectionStart + tagBegin.length;
    } else {
      selectionStart = this.value.length + tagBegin.length;
      this.value += text;
    }

    // TODO: Usage of setTimeout() should be avoided. Find a better solution.
    setTimeout(() => {
      this.textArea.nativeElement.focus();
      this.textArea.nativeElement.setSelectionRange(selectionStart, selectionStart + tagText.length);
    });
  }

  onSelect(event): void {
    this.selection = event.target;
  }

  onClick(event): void {
    this.selection = event.target;
  }

}
