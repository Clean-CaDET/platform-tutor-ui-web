import { MatDialog } from '@angular/material/dialog';
import { WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { DeleteFormComponent } from './delete-form.component';

export function deleteWithConfirmation<T extends { id?: number }>(
  dialog: MatDialog,
  deleteFn: () => Observable<unknown>,
  items: WritableSignal<T[]>,
  itemId: number,
): void {
  dialog.open(DeleteFormComponent).afterClosed().subscribe(confirmed => {
    if (!confirmed) return;
    deleteFn().subscribe(() => {
      items.update(data => data.filter(e => e.id !== itemId));
    });
  });
}
