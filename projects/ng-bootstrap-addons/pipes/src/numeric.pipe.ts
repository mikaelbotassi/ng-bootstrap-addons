import { Pipe, PipeTransform } from '@angular/core';
import { toPtBr, toPtBrAutoPrecision } from 'ng-bootstrap-addons/utils';

@Pipe({
  name: 'numeric',
  standalone: true
})
export class NumericPipe implements PipeTransform {

  transform(value: unknown, currency: boolean = false, decimalPlaces?:number, autoPrecision: boolean = false): unknown {
    if (typeof value !== 'number') {
      return value;
    }

    decimalPlaces = decimalPlaces ? decimalPlaces : (currency ? 2 : decimalPlaces);

    const formattedValue = autoPrecision ? toPtBrAutoPrecision(value) : toPtBr(value, decimalPlaces);

    return currency ? `R$ ${formattedValue}` : formattedValue;
  }

}
