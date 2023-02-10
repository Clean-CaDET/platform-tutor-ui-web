import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'cc-generic-selection-form',
  templateUrl: './generic-selection-form.component.html',
  styleUrls: ['./generic-selection-form.component.scss']
})
export class GenericSelectionFormComponent implements OnInit {
  selectionControl = new FormControl('');
  label: string;
  options: any[];
  presentationFunction: (item: any) => string
  filteredOptions: Observable<string[]>;

  constructor(private dialogRef: MatDialogRef<GenericSelectionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.options = data.items;
      this.presentationFunction = data.presentationFunction
      this.label = data.label;
    }

  ngOnInit(): void {
    this.filteredOptions = this.selectionControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => this.presentationFunction(option).toLowerCase().includes(filterValue));
  }

  onSubmit(): void {
    let item = this.findSelectedItem();
    this.dialogRef.close(item);
  }

  noItemSelected() {
    return !this.findSelectedItem();
  }

  private findSelectedItem() {
    return this.options.find(o => this.presentationFunction(o) === this.selectionControl.value)
  }

  onClose(): void {
    this.dialogRef.close(null);
  }
}
