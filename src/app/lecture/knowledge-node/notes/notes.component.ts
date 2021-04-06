import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cc-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {

  edit = false;

  constructor() { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.edit = false;
  }
}
