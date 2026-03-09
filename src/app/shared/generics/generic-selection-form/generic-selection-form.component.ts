import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'cc-generic-selection-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, AsyncPipe, MatDialogContent, MatFormFieldModule,
    MatInputModule, MatAutocompleteModule, MatButtonModule,
  ],
  template: `
    <mat-dialog-content class="flex-col" style="width: 500px;">
      <form>
        <mat-form-field style="width: 100%;">
          <mat-label>{{ label }}</mat-label>
          <input type="text" placeholder="Odaberi ili pretraži" matInput [formControl]="selectionControl" [matAutocomplete]="auto">
          <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete">
            @for (option of filteredOptions | async; track presentationFunction(option)) {
              <mat-option [value]="presentationFunction(option)">
                {{ presentationFunction(option) }}
              </mat-option>
            }
          </mat-autocomplete>
        </mat-form-field>
      </form>
      <div class="flex-row gap">
        <button matButton="filled" [disabled]="noItemSelected()" (click)="onSubmit()">Sačuvaj</button>
        <button matButton="outlined" (click)="onClose()">Zatvori</button>
      </div>
    </mat-dialog-content>
  `,
})
export class GenericSelectionFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<GenericSelectionFormComponent>);
  private readonly data = inject<{ items: unknown[]; presentationFunction: (item: unknown) => string; label: string }>(MAT_DIALOG_DATA);

  selectionControl = new FormControl('');
  label: string;
  options: unknown[];
  presentationFunction: (item: unknown) => string;
  filteredOptions!: Observable<unknown[]>;

  constructor() {
    this.options = this.data.items;
    this.presentationFunction = this.data.presentationFunction;
    this.label = this.data.label;
  }

  ngOnInit(): void {
    this.filteredOptions = this.selectionControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): unknown[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => this.presentationFunction(option).toLowerCase().includes(filterValue));
  }

  onSubmit(): void {
    const item = this.findSelectedItem();
    this.dialogRef.close(item);
  }

  noItemSelected(): boolean {
    return !this.findSelectedItem();
  }

  private findSelectedItem(): unknown | undefined {
    return this.options.find(o => this.presentationFunction(o) === this.selectionControl.value);
  }

  onClose(): void {
    this.dialogRef.close(null);
  }
}
