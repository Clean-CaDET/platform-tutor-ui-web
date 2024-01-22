import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cc-unit-controls',
  templateUrl: './unit-controls.component.html',
  styleUrls: ['./unit-controls.component.scss']
})
export class UnitControlsComponent implements OnInit {
  @Input() unitId: number;
  @Input() courseId: number;
  @Input() notesExpanded: boolean;
  @Output() expandNotes = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  openNotes() {
    this.expandNotes.emit(!this.notesExpanded);
  }
}
