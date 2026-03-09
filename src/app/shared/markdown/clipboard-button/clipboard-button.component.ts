import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'cc-clipboard-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <button matIconButton matTooltip="Kopiraj" (click)="onClick()">
      @if (!active()) {
        <mat-icon>content_copy</mat-icon>
      } @else {
        <mat-icon class="check-icon">check</mat-icon>
      }
    </button>
  `,
  styles: `
    button { scale: 0.8; }
    .check-icon { color: var(--mat-sys-primary); }
  `,
})
export class ClipboardButtonComponent {
  readonly active = signal(false);

  onClick(): void {
    this.active.set(true);
    setTimeout(() => this.active.set(false), 2000);
  }
}
