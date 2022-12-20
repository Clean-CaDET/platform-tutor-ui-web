import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CrudService } from './crud.service';
import { DeleteFormComponent } from '../delete-form/delete-form.component';
import { GenericFormComponent } from '../generic-form/generic-form.component';

@Component({
  selector: 'cc-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnInit {
  @Input() baseUrl : string;
  dataSource;

  @Input() fieldConfiguration;
  columns: string[];

  @Input() pageProperties = {
    page: 0,
    pageSize: 36,
    totalCount: 0,
    pageSizeOptions: [18, 36, 300]
  };

  selectedItem;
  @Output() select = new EventEmitter();
  
  constructor(private dialog: MatDialog, private httpService: CrudService<any>) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit(): void {
    this.columns = []
    this.fieldConfiguration.forEach(element => {
      if(element.type == 'password') return;
      this.columns.push(element.code)
    });
    this.getPagedEntities();
  }

  pageChanged(pageEvent: PageEvent) {
    if (!pageEvent) return;
    this.pageProperties.page = pageEvent.pageIndex;
    this.pageProperties.pageSize = pageEvent.pageSize;
    this.getPagedEntities();
  }

  private getPagedEntities() {
    this.httpService.getAll(this.baseUrl, this.pageProperties)
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
      if(!result) return;
      this.httpService.create(this.baseUrl, result).subscribe(response => {
        this.dataSource.data.push(response);
        this.dataSource._updateChangeSubscription();
      });
    });
  }
  
  onEdit(id: number): void {
    const dialogRef = this.openDialog(this.dataSource.data.find(e => e['id'] == id));

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.httpService.update(this.baseUrl, result).subscribe((response) => {
        this.dataSource = new MatTableDataSource(this.dataSource.data.map(e => e.id !== id ? e : response));
      });
    });
  }

  private openDialog(entity: any) {
    return this.dialog.open(GenericFormComponent, {
      data: {entity: entity, fieldConfiguration: this.fieldConfiguration},
    });
  }

  onArchive(id: number, archive: boolean): void {
    this.httpService.archive(this.baseUrl, id, archive).subscribe(response => {
      //this.dataSource = new MatTableDataSource(this.dataSource.data.filter(e => e.id !== id));
      this.dataSource = new MatTableDataSource(this.dataSource.data.map(e => e.id !== id ? e : response));
    })
  }

  onDelete(id: number): void {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(result) this.httpService.delete(this.baseUrl, id).subscribe(() => {
        this.dataSource = new MatTableDataSource(this.dataSource.data.filter(e => e.id !== id));
      })
    })
  }

  selectElement(element: any) {
    this.selectedItem = element;
    this.select.emit(this.selectedItem);
  }
}