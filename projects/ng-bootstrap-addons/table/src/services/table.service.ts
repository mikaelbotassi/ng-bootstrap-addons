import { Injectable, signal } from "@angular/core";

@Injectable()
export default class TableService {

    columnFilterValues = signal<Record<string, any>>({});

    setFilterValue(field: string, value: any) {
        this.columnFilterValues.update(values => ({...values, [field]: value}));
    }

    removeFilterValue(field: string) {
        this.columnFilterValues.update(values => {
            const newValues = {...values};
            delete newValues[field];
            return newValues;
        });
    }

}