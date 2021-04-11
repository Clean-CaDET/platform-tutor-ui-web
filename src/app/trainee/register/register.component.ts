import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TraineeService } from '../service/trainee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cc-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    index: new FormControl(''),
    visualScore: new FormControl(''),
    auralScore: new FormControl(''),
    readWriteScore: new FormControl(''),
    kinaestheticScore: new FormControl('')
  });

  constructor(
    private traineeService: TraineeService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onRegister(): void {
    this.traineeService.register(this.registerForm.value).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

}
