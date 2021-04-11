import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TraineeService } from '../service/trainee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cc-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    index: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private traineeService: TraineeService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onLogin(): void {
    this.traineeService.login(this.loginForm.value).subscribe(() => {
      this.router.navigate(['']);
    });
  }
}
