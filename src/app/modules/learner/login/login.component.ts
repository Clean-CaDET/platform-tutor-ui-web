import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LearnerService } from '../learner.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InterfacingInstructor } from '../../instructor/interfacing-instructor.service';

@Component({
  selector: 'cc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    studentIndex: new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required ])
  });
  hasError: boolean;

  constructor(
    private learnerService: LearnerService,
    private router: Router,
    private instructor: InterfacingInstructor) { }

  ngOnInit(): void {
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.learnerService.login(this.loginForm.value).subscribe(() => {
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
