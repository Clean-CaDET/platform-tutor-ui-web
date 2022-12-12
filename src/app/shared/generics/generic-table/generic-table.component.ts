import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CrudService } from '../crud.service';
import { GenericFormComponent } from '../generic-form/generic-form.component';

@Component({
  selector: 'cc-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnInit {
  @Input() httpService : CrudService<any>;
  dataSource;

  @Input() fieldConfiguration;
  columns: string[];

  @Input() pageProperties = {
    page: 0,
    pageSize: 36,
    totalCount: 0,
    pageSizeOptions: [18, 36, 300]
  };
  
  constructor(private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.columns = this.fieldConfiguration.map(f => f.code);
    this.getPagedEntities();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createEnabled(): boolean {
    let crud = this.fieldConfiguration.find(f => f.type == 'CRUD');
    return crud?.create;
  }

  onCreate(): void {
    const dialogRef = this.openDialog({});

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }
  
  onEdit(id: number): void {
    const dialogRef = this.openDialog(this.dataSource.data.find(e => e['id'] == id));

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  private openDialog(entity: any) {
    return this.dialog.open(GenericFormComponent, {
      data: {entity: entity, fieldConfiguration: this.fieldConfiguration},
    });
  }

  onArchive(id: number): void {
    console.log(id);
  }

  onDelete(id: number): void {
    console.log(id);
  }
}
