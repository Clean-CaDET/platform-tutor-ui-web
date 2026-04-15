import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CcMarkdownComponent } from '../../../../shared/markdown/cc-markdown.component';

@Component({
  selector: 'cc-elaboration-composer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatDividerModule, MatProgressSpinnerModule,
    CcMarkdownComponent,
  ],
  templateUrl: './elaboration-composer.component.html',
  styleUrl: './elaboration-composer.component.scss',
})
export class ElaborationComposerComponent {
  readonly disabled = input(false);
  readonly thinking = input(false);
  readonly pinnedQuestion = input<string>('');

  readonly submitted = output<string>();
  readonly abandoned = output<void>();

  readonly content = new FormControl('', { nonNullable: true });

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
