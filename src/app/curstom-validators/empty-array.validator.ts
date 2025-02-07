import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from '@angular/forms';

export function notEmptyArrayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const formArray = control as FormArray;
    return formArray.length > 0 ? null : { emptyArray: true };
  };
}