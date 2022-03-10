import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms'


@Component({
    selector: 'cc-emotions',
    templateUrl: './emotions.component.html',
    styleUrls: ['./emotions.component.css']
})
export class EmotionsComponent implements OnInit {

    emotionsForm = new FormGroup({
        emotionsFeedback: new FormControl('', [
            Validators.required,
            this.emotionsValidator()])
    });

    constructor() {}

    ngOnInit(): void {
    }

    onSubmit(): void {
        if (this.emotionsForm.valid) {
            alert("Ok");
        } else {
            alert("Fail");
        }
    }

    emotionsValidator(): ValidatorFn {
        return (control: AbstractControl): {[key: string]: any} | null => {
            const valid = control.value.length > 10;
            return valid ? null : { shortText: { value: control.value } };
        };
    }

}