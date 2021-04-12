import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'cc-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.css']
})
export class MarkdownEditorComponent implements OnInit {

  text = '';
  livePreview = true;
  selection: any;
  @ViewChild('textAreaElement') textArea: HTMLTextAreaElement;
  @Input() mode = 'edit';

  constructor() { }

  ngOnInit(): void {
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
      case 'h4':
        tagBegin = '#### ';
        tagText = 'Heading 4';
        break;
      case 'h5':
        tagBegin = '##### ';
        tagText = 'Heading 5';
        break;
      case 'h6':
        tagBegin = '###### ';
        tagText = 'Heading 6';
        break;
    }
    if (this.selection) {
      if (this.selection.selectionStart !== this.selection.selectionEnd) {
        tagText = this.text.slice(this.selection.selectionStart, this.selection.selectionEnd);
      }
    }
    const text = tagBegin + tagText + tagEnd;

    if (this.selection) {
      this.text = this.text.slice(0, this.selection.selectionStart) + text + this.text.slice(this.selection.selectionEnd);
    } else {
      this.text += text;
    }
  }

  onSelect(event): void {
    this.selection = event.target;
  }

  onClick(event): void {
    this.selection = event.target;
  }

}
