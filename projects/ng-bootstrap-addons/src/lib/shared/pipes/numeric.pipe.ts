import { Pipe, PipeTransform } from '@angular/core';
import Formatter from '../../../utils/formater';

@Pipe({
  name: 'numeric',
  standalone: true
})
export class NumericPipe implements PipeTransform {

  transform(value: unknown, currency: boolean = false, decimalPlaces?:number): unknown {
    if (typeof value !== 'number') {
      return value;
    }

    const formattedValue = (new Formatter).formatDecimalNumber(value, decimalPlaces);

    return currency ? `R$ ${formattedValue}` : formattedValue;
  }

}
