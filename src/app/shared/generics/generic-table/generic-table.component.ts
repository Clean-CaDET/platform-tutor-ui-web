import { Component, ChangeDetectionStrategy, inject, input, output, signal, effect } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { CrudService } from './crud.service';
import { DeleteFormComponent } from '../delete-form/delete-form.component';
import { GenericFormComponent } from '../generic-form/generic-form.component';
import { Field } from '../model/field.model';
import { Entity } from '../model/entity.model';
import { FieldOptionsPipe } from './field-option.pipe';

@Component({
  selector: 'cc-generic-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe, MatCardModule, MatIconModule, MatTableModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatTooltipModule, FieldOptionsPipe,
  ],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss',
})
export class GenericTableComponent {
  private readonly dialog = inject(MatDialog);
  private readonly httpService = inject<CrudService<Entity>>(CrudService);
  private readonly errorsBar = inject(MatSnackBar);

  readonly title = input<string>('');
  readonly baseUrl = input.required<string>();
  readonly fieldConfiguration = input.required<Field[]>();
  readonly selectItem = output<Entity>();

  readonly pageProperties = signal({
    page: 0,
    pageSize: 36,
    totalCount: 0,
    pageSizeOptions: [18, 36, 300] as number[],
  });

  readonly dataSource = signal(new MatTableDataSource<Entity>([]));
  readonly columns = signal<string[]>([]);
  readonly crud = signal<Field | undefined>(undefined);
  readonly selectedItem = signal<Entity | null>(null);

  constructor() {
    effect(() => {
      const fields = this.fieldConfiguration();
      this.selectedItem.set(null);
      const cols: string[] = [];
      fields.forEach(element => {
        if (element.type === 'password') return;
        cols.push(element.code);
      });
      this.columns.set(cols);
      this.crud.set(fields.find(f => f.type === 'CRUD'));
      this.getPagedEntities();
    });
  }

  pageChanged(pageEvent: PageEvent): void {
    if (!pageEvent) return;
    this.pageProperties.update(p => ({ ...p, page: pageEvent.pageIndex, pageSize: pageEvent.pageSize }));
    this.getPagedEntities();
  }

  private getPagedEntities(): void {
    this.httpService.getAll(this.baseUrl(), this.pageProperties())
      .subscribe(response => {
        this.dataSource.set(new MatTableDataSource(response.results));
        this.pageProperties.update(p => ({ ...p, totalCount: response.totalCount }));
        if (response.results.length === 1) this.selectElement(response.results[0]);
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource().filter = filterValue.trim().toLowerCase();
  }

  onCreate(): void {
    const dialogRef = this.openDialog({}, '### Dodavanje');
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.httpService.create(this.baseUrl(), result).subscribe({
        next: () => this.getPagedEntities(),
        error: (error) => {
          if (error.error?.status === 400)
            this.errorsBar.open('Nevalidni podaci.', 'OK', { horizontalPosition: 'right', verticalPosition: 'top' });
        },
      });
    });
  }

  onBulkCreate(): void {
    const bulkCreateDialogComponent = this.crud()?.crud?.bulkCreateDialogComponent;
    if (!bulkCreateDialogComponent) return;
    const dialogRef = this.dialog.open(bulkCreateDialogComponent, { width: '900px' });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.httpService.bulkCreate(this.baseUrl(), result).subscribe(() => {
        this.getPagedEntities();
      });
    });
  }

  onClone(id: number): void {
    const dialogRef = this.openDialog(this.dataSource().data.find(e => e.id === id) ?? {}, '### Kloniranje');
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      delete result.id;
      this.httpService.clone(this.baseUrl(), id, result).subscribe(() => {
        this.getPagedEntities();
      });
    });
  }

  onEdit(id: number): void {
    const dialogRef = this.openDialog(this.dataSource().data.find(e => e.id === id) ?? {}, '### Izmena');
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.httpService.update(this.baseUrl(), result).subscribe(response => {
        this.dataSource.set(new MatTableDataSource(this.dataSource().data.map(e => e.id !== id ? e : response)));
      });
    });
  }

  private openDialog(entity: unknown, label: string) {
    return this.dialog.open(GenericFormComponent, {
      data: { entity, fieldConfiguration: this.fieldConfiguration(), label },
    });
  }

  onArchive(id: number, archive: boolean): void {
    this.httpService.archive(this.baseUrl(), id, archive).subscribe(response => {
      this.dataSource.set(new MatTableDataSource(this.dataSource().data.map(e => e.id !== id ? e : response)));
    });
  }

  onDelete(id: number, secureDelete: boolean): void {
    const diagRef = this.dialog.open(DeleteFormComponent, { data: { secureDelete } });
    diagRef.afterClosed().subscribe(result => {
      if (result) {
        this.httpService.delete(this.baseUrl(), id).subscribe(() => {
          this.dataSource.set(new MatTableDataSource(this.dataSource().data.filter(e => e.id !== id)));
        });
      }
    });
  }

  selectElement(element: Entity): void {
    this.selectedItem.set(element);
    this.selectItem.emit(element);
  }
}
