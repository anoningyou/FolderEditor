import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { map, Observable, take } from "rxjs";

export class StringValidators {

    public static stringNotInArray(strings: string[],
                                    toLover: boolean = true,
                                    errorCode: string = "stringNotInArray") : ValidatorFn {
      return (control: AbstractControl): ValidationErrors | null => {
        if (!strings?.length)
          return null;

        const value = toLover
          ? control.value?.toLowerCase()
          : control.value;

        return strings.includes(value)
          ? {[errorCode]: true}
          : null;
      }
    }

    public static stringNotInArrayAsync(strings: Observable<string[]>,
                                        toLover: boolean = true,
                                        errorCode: string = "stringNotInArray") : AsyncValidatorFn {
      return (control: AbstractControl): Observable<ValidationErrors | null> => {
        return strings
          .pipe(
            take(1),
            map(strings => {
              if (!strings?.length)
                return null;

              const value = toLover
                ? control.value?.toLowerCase()
                : control.value;

              return strings.includes(value)
                ? {[errorCode]: true}
                : null;
            })
          );
      }
  }
}
