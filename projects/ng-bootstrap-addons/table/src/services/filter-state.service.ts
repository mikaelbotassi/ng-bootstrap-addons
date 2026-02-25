import { Injectable, signal } from '@angular/core';
import { DateUtils } from 'ng-bootstrap-addons/utils';
import { ColumnFilterType, FilterFunction, ColumnFilterPredicate } from '../models/table-models';

@Injectable()
export class FilterStateService {

    value = signal<any>(null);

    getDefaultFilterFunction(type: ColumnFilterType | null): ColumnFilterPredicate {
        switch (type) {
            case 'text':
                return (item: any, value: string) => {
                    if (typeof item !== 'string') return false;
                    if (!item) return false;
                    if (!value) return true;
                    return item?.toString().toLowerCase()?.includes(value?.toLowerCase());
                };
            case 'date':
                return (item: any, value: (Date | undefined)[] | undefined) => {
                    if (!item) return false;
                    if (!value) return true;
                    if (!Array.isArray(value) || value.length !== 2) return true;
                    const [start, end] = value;
                    if (!start || !end) return true;
                    if (!DateUtils.isDate(item)) return false;
                    const dateItem = DateUtils.toDate(item);
                    return dateItem >= start && dateItem <= end;
                };
            case 'numeric':
                return (item: any, value: (number | null)[] | null) => {
                    if (typeof item !== 'number' || isNaN(item)) return false;
                    if (!value || !Array.isArray(value)) return true;
                    const initialValue = value[0];
                    const finalValue = value[1];
                    if (!initialValue && !finalValue) return true;
                    if (item >= initialValue! && !finalValue) return true;
                    if (!initialValue && item <= finalValue!) return true;
                    return item >= initialValue! && item <= finalValue!;
                };
            case 'boolean':
                return (item: any, value: boolean) => {
                    if (typeof item !== 'boolean') return false;
                    return item === value;
                };
            default:
                return () => true;
        }
    }

    applyFilter(type: ColumnFilterType | null) : FilterFunction {
        const filterFunction = this.getDefaultFilterFunction(type);

        const v = this.value();

        return (item: any) => filterFunction(item, v);
    }

    clearFilter() {
        this.value.set(null);
    }

}
