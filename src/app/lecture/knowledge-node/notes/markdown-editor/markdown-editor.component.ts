import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cc-markdown-editor',
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.css']
})
export class MarkdownEditorComponent implements OnInit {

  text: string;
  livePreview = true;
  @Input() mode = 'edit';

  constructor() { }

  ngOnInit(): void {
  }

}
