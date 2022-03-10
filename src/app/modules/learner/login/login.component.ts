import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LearnerService } from '../learner.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {NavbarService} from '../../layout/navbar/navbar.service';

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
    private navbarService: NavbarService) { }

  ngOnInit(): void {
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.learnerService.login(this.loginForm.value).subscribe(() => {
        this.navbarService.updateContent('updateUnits');
        this.router.navigate(['/']);
      }, (error) => {
        if (error instanceof HttpErrorResponse) {
          this.hasError = true;
        }
      });
    }
  }
}
