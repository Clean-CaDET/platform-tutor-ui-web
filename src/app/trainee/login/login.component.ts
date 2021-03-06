import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TraineeService } from '../service/trainee.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'cc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    studentIndex: new FormControl('', [ Validators.required ]),
  });
  hasError: boolean;

  constructor(
    private traineeService: TraineeService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.traineeService.login(this.loginForm.value).subscribe(() => {
        this.router.navigate(['/']);
      }, (error) => {
        if (error instanceof HttpErrorResponse) {
          this.hasError = true;
        }
      });
    }
  }
}
