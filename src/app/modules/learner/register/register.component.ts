import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { LearnerService } from '../learner.service';
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
  });

  constructor(
    private learnerService: LearnerService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.learnerService.register(this.registerForm.value).subscribe(() => {
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
