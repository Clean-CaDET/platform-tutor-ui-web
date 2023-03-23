import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LearningObserverComponent } from './learning-observer/learning-observer.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly modalOpenInterval = 15 * 60 * 1000; //minutes * seconds * milliseconds
  private modalInterval: any;

  constructor(private dialog: MatDialog) {
    this.startModalInterval();
  }

  openModal() {
    const dialogRef = this.dialog.open(LearningObserverComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  startModalInterval(): void {
    this.modalInterval = setInterval(() => {
      this.openModal();
    }, this.modalOpenInterval);
  }

  stopModalInterval(): void {
    clearInterval(this.modalInterval);
  }

  closeDialog():void {
    this.dialog.closeAll()
  }
}