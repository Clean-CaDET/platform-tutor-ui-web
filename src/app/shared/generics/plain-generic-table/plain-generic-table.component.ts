import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DeleteFormComponent } from '../delete-form/delete-form.component';

@Component({
  selector: 'cc-plain-generic-table',
  templateUrl: './plain-generic-table.component.html',
  styleUrls: ['./plain-generic-table.component.scss']
})
export class PlainGenericTableComponent implements OnChanges {
  @Input() items : any[];
  dataSource;

  @Input() fieldConfiguration;
  columns: string[];

  selectedItem;
  @Output() select = new EventEmitter();
  @Output() delete = new EventEmitter();
  
  constructor(private dialog: MatDialog) {}

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource(this.items);
    this.columns = []
    this.fieldConfiguration.forEach(element => {
      if(element.type == 'password') return;
      this.columns.push(element.code)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onDelete(id: number): void {
    let diagRef = this.dialog.open(DeleteFormComponent);

    diagRef.afterClosed().subscribe(result => {
      if(result) this.delete.emit(id);
    })
  }

  selectElement(element: any) {
    this.selectedItem = element;
    this.select.emit(this.selectedItem);
  }
}
