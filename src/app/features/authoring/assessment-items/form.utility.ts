import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

export function createHintFormGroup(text: string): FormGroup {
  return new FormGroup({
    text: new FormControl(text, { validators: Validators.required, nonNullable: true }),
  });
}

export function addHint(hintsArray: FormArray, text: string): void {
  hintsArray.push(createHintFormGroup(text));
}

export function removeHint(hintsArray: FormArray, index: number): void {
  hintsArray.removeAt(index);
}

export function getHintValues(hintsArray: FormArray): string[] {
  return hintsArray.value.map((o: Record<string, string>) => o['text']);
}
