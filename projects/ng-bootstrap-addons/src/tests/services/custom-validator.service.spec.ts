import { TestBed } from '@angular/core/testing';
import { CustomValidatorService } from 'services/custom-validator.service';
import { NumericPipe } from 'pipes/numeric.pipe';

describe('CustomValidatorService', () => {
  let service: CustomValidatorService;
  let numericPipe: NumericPipe;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('NumericPipe', ['transform']);
    TestBed.configureTestingModule({
      providers: [CustomValidatorService, NumericPipe]
    });
    service = TestBed.inject(CustomValidatorService);
    numericPipe = service['numericPipe'];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return required message', () => {
    const messages = service.getValidatorMessages({ required: true });
    expect(messages).toEqual(['Este campo é obrigatório']);
  });

  it('should return email message', () => {
    const messages = service.getValidatorMessages({ email: true });
    expect(messages).toEqual(['O formato do e-mail não é válido']);
  });

  it('should return minlength message', () => {
    const messages = service.getValidatorMessages({
      minlength: { requiredLength: 5, actualLength: 2 }
    });
    expect(messages).toEqual(['Mínimo de 5 caracteres']);
  });

  it('should return maxlength message', () => {
    const messages = service.getValidatorMessages({
      maxlength: { requiredLength: 10, actualLength: 12 }
    });
    expect(messages).toEqual(['Máximo de 10 caracteres']);
  });

  it('should return pattern message', () => {
    const messages = service.getValidatorMessages({ pattern: true });
    expect(messages).toEqual(['O formato não é válido']);
  });

  it('should return min message with formatted value', () => {
    const spy = spyOn(numericPipe, 'transform').and.returnValue('10');
    const messages = service.getValidatorMessages({
      min: { min: 10, actual: 5 }
    });
    expect(messages).toEqual(['O valor mínimo permitido é 10']);
    expect(spy).toHaveBeenCalledWith(10, false, undefined);
  });

  it('should return max message with formatted value', () => {
    const spy = spyOn(numericPipe, 'transform').and.returnValue('100');
    const messages = service.getValidatorMessages({
      max: { max: 100, actual: 150 }
    });
    expect(messages).toEqual(['O valor máximo permitido é 100']);
    expect(spy).toHaveBeenCalledWith(100, false, undefined);
  });

  it('should return null when errors is null', () => {
    const messages = service.getValidatorMessages(null);
    expect(messages).toBeNull();
  });

  it('should return null when no matching validators', () => {
    const messages = service.getValidatorMessages({ unknown: true });
    expect(messages).toBeNull();
  });

  it('should add and return custom validator', () => {
    const customValidation = service.new('custom', {
      validator: () => () => null,
      message: 'Custom message'
    });
    expect(customValidation.message).toBe('Custom message');

    const messages = service.getValidatorMessages({ custom: true });
    expect(messages).toEqual(['Custom message']);
  });

  it('should return dynamic message for custom validator', () => {
    service.new('customFn', {
      validator: () => () => null,
      message: (obj: any) => `Dynamic ${obj.value}`
    });

    const messages = service.getValidatorMessages({
      customFn: { value: 'Test' }
    });
    expect(messages).toEqual(['Dynamic Test']);
  });
});
