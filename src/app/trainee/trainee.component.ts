import { Component, OnInit } from '@angular/core';
import { TraineeService } from './service/trainee.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'cc-trainee',
  templateUrl: './trainee.component.html',
  styleUrls: ['./trainee.component.css']
})
export class TraineeComponent implements OnInit {

  loginForm = new FormGroup({
    index: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private traineeService: TraineeService) { }

  ngOnInit(): void {
  }

  onLogin(): void {
    this.traineeService.login(this.loginForm.value)
  }

}
