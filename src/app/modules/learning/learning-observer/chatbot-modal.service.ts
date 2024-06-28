import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'src/app/infrastructure/auth/auth.service';
import { LearningObserverComponent } from './learning-observer.component';

@Injectable({providedIn: "root"})
export class ChatbotModalService {
  private readonly modalOpenInterval = 20 * 60 * 1000; //minutes * seconds * milliseconds
  private lastOpened: number;

  constructor(private dialog: MatDialog, private authService: AuthenticationService) {}

  openModal() {
    this.dialog.open(LearningObserverComponent, {
      disableClose: true,
    });
  }

  notify() {
    const user = this.authService.user$.getValue();
    if (user.role === 'learnercommercial' || !user.username.includes('GE')) return;
    const lastOpenedString = localStorage.getItem('lastOpened');
    if (lastOpenedString) {
      this.lastOpened = Number(lastOpenedString);
    } else {
      this.openModal();
      this.updateLastOpened();
    }
    const timeSinceLastOpened = Date.now() - this.lastOpened;
    if (timeSinceLastOpened >= this.modalOpenInterval) {
      this.openModal();
      this.updateLastOpened();
    }
  }

  private updateLastOpened(): void {
    this.lastOpened = Date.now();
    localStorage.setItem('lastOpened', this.lastOpened.toString());
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }
}
