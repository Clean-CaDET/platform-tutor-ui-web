import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth.service';
import { Login } from '../model/login.model';

@Component({
  selector: 'cc-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  readonly hasError = signal(false);
  readonly isSubmitting = signal(false);

  login(): void {
    if (this.loginForm.invalid) return;

    this.isSubmitting.set(true);
    const login: Login = {
      username: this.loginForm.value.username!,
      password: this.loginForm.value.password!,
    };

    this.authService.login(login).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        if (error instanceof HttpErrorResponse) {
          this.hasError.set(true);
          this.isSubmitting.set(false);
        }
      },
    });
  }
}
