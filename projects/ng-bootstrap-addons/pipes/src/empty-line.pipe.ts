import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'emptyLine'
})

export class EmptyLinePipe implements PipeTransform {
    transform(value: any): any {
        if(!value || (typeof value === 'string' && value.trim() === '')) {
            return '-';
        }
        return value;
    }
}