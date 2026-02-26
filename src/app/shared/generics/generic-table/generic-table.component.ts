import { Component, ChangeDetectionStrategy, inject, input, output, signal, computed, effect } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    DatePipe, MatIconModule, MatTableModule, MatPaginatorModule,
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
  readonly noPagination = input(false);
  readonly selectItem = output<Entity>();

  readonly currentPage = signal(0);
  readonly pageSize = signal(36);
  readonly totalCount = signal(0);
  readonly pageSizeOptions = [18, 36, 300];

  readonly columns = computed(() =>
    this.fieldConfiguration().filter(f => f.type !== 'password').map(f => f.code)
  );
  readonly crud = computed(() => this.fieldConfiguration().find(f => f.type === 'CRUD'));
  readonly selectedItem = signal<Entity | null>(null);

  private readonly entitiesResource = rxResource({
    params: () => ({
      baseUrl: this.baseUrl(),
      fields: this.fieldConfiguration(),
      pageProps: this.noPagination() ? null : { page: this.currentPage(), pageSize: this.pageSize() },
    }),
    stream: ({ params }) => this.httpService.getAll(params.baseUrl, params.pageProps),
    defaultValue: { results: [] as Entity[], totalCount: 0 },
  });

  readonly dataSource = computed(() => new MatTableDataSource(this.entitiesResource.value().results));

  constructor() {
    effect(() => {
      const data = this.entitiesResource.value();
      this.totalCount.set(data.totalCount);
      this.selectedItem.set(null);
      if (data.results.length === 1) this.selectElement(data.results[0]);
    });
  }

  pageChanged(pageEvent: PageEvent): void {
    if (!pageEvent) return;
    this.currentPage.set(pageEvent.pageIndex);
    this.pageSize.set(pageEvent.pageSize);
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
        next: () => this.entitiesResource.reload(),
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
    const dialogRef = this.dialog.open(bulkCreateDialogComponent, { minWidth: '900px' });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.httpService.bulkCreate(this.baseUrl(), result).subscribe(() => {
        this.entitiesResource.reload();
      });
    });
  }

  onClone(id: number): void {
    const dialogRef = this.openDialog(this.dataSource().data.find(e => e.id === id) ?? {}, '### Kloniranje');
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      delete result.id;
      this.httpService.clone(this.baseUrl(), id, result).subscribe(() => {
        this.entitiesResource.reload();
      });
    });
  }

  onEdit(id: number): void {
    const dialogRef = this.openDialog(this.dataSource().data.find(e => e.id === id) ?? {}, '### Izmena');
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.httpService.update(this.baseUrl(), result).subscribe(response => {
        this.dataSource().data = this.dataSource().data.map(e => e.id !== id ? e : response);
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
      this.dataSource().data = this.dataSource().data.map(e => e.id !== id ? e : response);
    });
  }

  onDelete(id: number, secureDelete: boolean): void {
    const diagRef = this.dialog.open(DeleteFormComponent, { data: { secureDelete } });
    diagRef.afterClosed().subscribe(result => {
      if (result) {
        this.httpService.delete(this.baseUrl(), id).subscribe(() => {
          this.dataSource().data = this.dataSource().data.filter(e => e.id !== id);
        });
      }
    });
  }

  selectElement(element: Entity): void {
    this.selectedItem.set(element);
    this.selectItem.emit(element);
  }
}
