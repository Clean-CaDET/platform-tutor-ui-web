import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InterfacingInstructor } from '../../../modules/instructor/interfacing-instructor.service';

@Component({
  selector: 'cc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm = new FormGroup({
    username: new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required ])
  });
  hasError: boolean;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private instructor: InterfacingInstructor) { }

  login(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(() => {
        this.router.navigate(['/'])
          .then(() => this.instructor.greet());
      }, (error) => {
        if (error instanceof HttpErrorResponse) {
          this.hasError = true;
        }
      });
    }
  }
}
