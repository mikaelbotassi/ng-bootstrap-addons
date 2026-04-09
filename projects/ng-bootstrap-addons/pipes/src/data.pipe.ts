import { Pipe, PipeTransform } from '@angular/core';
import { DateUtils } from 'ng-bootstrap-addons/utils';

type AcceptedTypes = Date | string | undefined | null;

@Pipe({
  name: 'data'
})
export class DataPipe implements PipeTransform {

  transform(value: AcceptedTypes, format: string): string | undefined | null {
    if(!DateUtils.isDate(value)) return value as string | undefined | null;
    if(value instanceof Date) return DateUtils.format(value, format);
    return DateUtils.formatDateString(value!, format);
  }

}
