import { Component, ChangeDetectionStrategy, input, output, viewChild, effect, ElementRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'cc-elaboration-composer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatDividerModule, MatProgressSpinnerModule,
  ],
  templateUrl: './elaboration-composer.component.html',
  styleUrl: './elaboration-composer.component.scss',
})
export class ElaborationComposerComponent {
  readonly disabled = input(false);
  readonly thinking = input(false);

  readonly submitted = output<string>();
  readonly abandoned = output<void>();

  readonly content = new FormControl('', { nonNullable: true });

  private readonly textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  constructor() {
    effect(() => {
      const ref = this.textareaRef();
      if (ref && !this.disabled()) {
        queueMicrotask(() => ref.nativeElement.focus());
      }
    });
  }

  onSubmit(): void {
    if (this.disabled()) return;
    const value = this.content.value.trim();
    if (!value) return;
    this.submitted.emit(value);
    this.content.setValue('');
  }

  onAbandon(): void {
    if (this.disabled()) return;
    this.abandoned.emit();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      this.onSubmit();
    }
  }

  restore(value: string): void {
    this.content.setValue(value);
  }
}
