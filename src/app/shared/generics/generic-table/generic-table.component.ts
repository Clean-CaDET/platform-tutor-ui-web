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
  dataSource;

  @Input() fieldConfiguration;
  columns;

  @Input() pageProperties = {
    page: 0,
    pageSize: 36,
    totalCount: 0,
    pageSizeOptions: [18, 36, 300]
  };
  
  constructor() {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.columns = Object.keys(this.fieldConfiguration);
    this.getPagedEntities();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  pageChanged(pageEvent: PageEvent) {
    if (!pageEvent) return;
    this.pageProperties.page = pageEvent.pageIndex;
    this.pageProperties.pageSize = pageEvent.pageSize;
    this.getPagedEntities();
  }

  private getPagedEntities() {
    this.httpService.getAll(this.pageProperties)
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response.results);
        this.pageProperties.totalCount = response.totalCount;
      });
  }
}
