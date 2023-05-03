import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { CrudService } from './crud.service';
import { DeleteFormComponent } from '../delete-form/delete-form.component';
import { GenericFormComponent } from '../generic-form/generic-form.component';
import { Field } from '../model/field.model';
import { Entity } from '../model/entity.model';

@Component({
  selector: 'cc-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnChanges {
  @Input() title : string;
  @Input() baseUrl : string;
  dataSource;

  @Input() fieldConfiguration: Field[];
  columns: string[];
  crud: Field;

  @Input() pageProperties = {
     page: 0,
     pageSize: 36,
     totalCount: 0,
     pageSizeOptions: [18, 36, 300]
  };

  selectedItem: any;
  @Output() selectItem = new EventEmitter();

  constructor(private dialog: MatDialog, private httpService: CrudService<Entity>) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnChanges(): void {
    this.selectedItem = null;
    this.columns = []
    this.fieldConfiguration.forEach(element => {
      if(element.type === 'password') return;
      this.columns.push(element.code)
    });
    this.crud = this.fieldConfiguration.find(f => f.type === 'CRUD');
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
        if(this.pageProperties) this.pageProperties.totalCount = response.totalCount;
        if(response.results.length === 1) this.selectElement(response.results[0]);
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onCreate(): void {
    const dialogRef = this.openDialog({}, "Dodavanje");

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.httpService.create(this.baseUrl, result).subscribe(() => {
        this.getPagedEntities();
      });
    });
  }

  onBulkCreate(): void {
    const bulkCreateDialogComponent = this.crud?.crud.bulkCreateDialogComponent;
    if(!bulkCreateDialogComponent) return;

    const dialogRef = this.dialog.open(bulkCreateDialogComponent, {height: '600px', width: '900px'});

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.httpService.bulkCreate(this.baseUrl, result).subscribe(() => {
        this.getPagedEntities();
      });
    });
  }

  onClone(id: number): void {
    const dialogRef = this.openDialog(this.dataSource.data.find(e => e['id'] === id), "Kloniranje");

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      delete result.id;
      this.httpService.clone(this.baseUrl, id, result).subscribe(() => {
        this.getPagedEntities();
      });
    });
  }

  onEdit(id: number): void {
    const dialogRef = this.openDialog(this.dataSource.data.find(e => e['id'] === id), "Izmena");

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.httpService.update(this.baseUrl, result).subscribe(response => {
        this.dataSource = new MatTableDataSource(this.dataSource.data.map(e => e.id !== id ? e : response));
      });
    });
  }

  private openDialog(entity: any, label: string) {
    return this.dialog.open(GenericFormComponent, {
      data: {entity, fieldConfiguration: this.fieldConfiguration, label},
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

  selectElement(element: any): void {
    this.selectedItem = element;
    this.selectItem.emit(this.selectedItem);
  }
}
