import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'cc-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnInit {
  @Input() data;
  @Input() columns;
  @Input() labels;

  constructor() {
    this.data = new MatTableDataSource([]);
  }

  ngOnInit(): void {
  }

}
