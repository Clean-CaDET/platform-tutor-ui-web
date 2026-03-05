import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  error(message = 'Greška: Zahtev nije obrađen. Probaj da ponoviš operaciju.'): void {
    this.snackBar.open(message, 'OK', { duration: 5000, horizontalPosition: 'right', verticalPosition: 'top' });
  }

  success(message: string): void {
    this.snackBar.open(message, 'Zatvori', { duration: 3000, horizontalPosition: 'right' });
  }

  info(message: string): void {
    this.snackBar.open(message, 'Zatvori', { duration: 2000, horizontalPosition: 'right' });
  }
}
