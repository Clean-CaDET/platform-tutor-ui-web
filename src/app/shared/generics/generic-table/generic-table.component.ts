import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CrudService } from '../crud.service';

@Component({
  selector: 'cc-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnInit {
  @Input() httpService : CrudService<any>;
  data;

  @Input() columns;
  @Input() labels;

  @Input() pageProperties = {
    page: 0,
    pageSize: 2,
    pageSizeOptions: [1, 2, 6]
  };
  
  constructor() {
    this.data = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.getPagedEntities();
  }

  private getPagedEntities() {
    this.httpService.getAll(this.pageProperties)
      .subscribe(response => {
        this.data = response;
      });
  }

  pageChanged(pageEvent: PageEvent) {
    if (!pageEvent) return;
    this.pageProperties.page = pageEvent.pageIndex;
    this.pageProperties.pageSize = pageEvent.pageSize;
    this.getPagedEntities();
  }
}
