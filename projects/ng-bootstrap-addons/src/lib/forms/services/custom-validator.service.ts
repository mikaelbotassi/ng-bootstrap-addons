import { Injectable } from '@angular/core';
import { ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NumericPipe } from '../../shared/pipes/numeric.pipe';

@Injectable({
  providedIn: 'root',
})
export class CustomValidatorService {

  private numericPipe: NumericPipe = new NumericPipe();

  /**
 * Lista de validações para ser lida pelo component FormErrorMessageComponent
 * @param key Nome da validação
 * @param validation Validação a ser aplicada
 */
  private _validators:Record<string, CustomValidation> = {
    required : {
      validator: () => Validators.required,
      message: 'Este campo é obrigatório'
    },
    email: {
      validator: () => Validators.email,
      message: 'O formato do e-mail não é válido'
    },
    minlength: {
      validator: (min: number) => Validators.minLength(min),
      message: (obj: {requiredLength:number, actualLength:number}) => `Mínimo de ${obj.requiredLength} caracteres`
    },
    maxlength: {
      validator: (max: number) => Validators.maxLength(max),
      message: (obj: {requiredLength:number, actualLength:number}) => `Máximo de ${obj.requiredLength} caracteres`
    },
    pattern: {
      validator: (pattern: string | RegExp) => Validators.pattern(pattern),
      message: 'O formato não é válido'
    },
    min: {
      validator: (min: number) => Validators.min(min),
      message: (obj: {min:number, actual:number}) => `O valor mínimo permitido é ${this.numericPipe.transform(obj.min, false, undefined)}`
    },
    max: {
      validator: (max: number) => Validators.max(max),
      message: (obj: {max:number, actual:number}) => `O valor máximo permitido é ${this.numericPipe.transform(obj.max, false, undefined)}`
    },
  };

  new(key:string, validation: CustomValidation):CustomValidation{
    this._validators[key] = validation;
    return validation;
  }

  getValidatorMessages(errors: ValidationErrors | null): Array<string> | null {
    if (!errors) return null;

    const messages: Array<string> = [];
    for (const [errorKey, errorValue] of Object.entries(errors)) {
      const validatorDefinition = this._validators[errorKey];
      if (validatorDefinition) {
        const message = typeof validatorDefinition.message === 'function'
        ? validatorDefinition.message(errorValue)
        : validatorDefinition.message;
        messages.push(message);
      }
    }

    return messages.length > 0 ? messages : null;
  }
  
}

export type ValidatorFactory = (...args: any[]) => ValidatorFn;
export interface CustomValidation {
  validator: ValidatorFactory;
  message: string | ((...args: any[]) => string);
}