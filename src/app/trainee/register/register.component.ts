import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TraineeService } from '../service/trainee.service';
import { Router } from '@angular/router';

@Component({
  selector: 'cc-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    studentIndex: new FormControl('', [
      Validators.required,
      this.indexValidator()]),
    visualScore: new FormControl('', [Validators.required]),
    auralScore: new FormControl('', [Validators.required]),
    readWriteScore: new FormControl('', [Validators.required]),
    kinaestheticScore: new FormControl('', [Validators.required])
  });

  constructor(
    private traineeService: TraineeService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.traineeService.register(this.registerForm.value).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }

  indexValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any } | null => {
      const indexRe = new RegExp('^[A-Za-z]{2,3}-[0-9]{1,3}-[0-9]{4}$');
      const valid = indexRe.test(control.value);
      return valid ? null : { invalidIndex: { value: control.value } };
    };
  }

}
