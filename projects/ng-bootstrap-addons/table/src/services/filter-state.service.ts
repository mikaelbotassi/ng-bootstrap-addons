import { Injectable, signal } from '@angular/core';
import { DateUtils, listPredicate, NumberUtils } from 'ng-bootstrap-addons/utils';
import { ColumnFilterType, FilterFunction, ColumnFilterPredicate } from '../models/table-models';

@Injectable()
export class FilterStateService {

    value = signal<any>(null);
    filterConfig = signal<ListFilterConfig|null>(null);

    applyFilter(type: ColumnFilterType | null) : FilterFunction {
        const filterFunction = this.getDefaultFilterFunction(type);

        const v = this.value();

        return (item: any) => filterFunction(item, v);
    }

    clearFilter = () => this.value.set(null);


    private isNil = (v: any): v is null | undefined => v === null || v === undefined;

    private isEmptyFilterValue(v: any): boolean {
        if (this.isNil(v)) return true;
        if (typeof v === 'string') return v.trim().length === 0;
        if (Array.isArray(v)) return v.length === 0 || v.every(this.isNil);
        return false;
    }

    private toLowerStr = (v: any): string | null => this.isNil(v) ? null : String(v).toLowerCase();

    private toDateSafe(v: any): Date | null {
        if (this.isNil(v)) return null;
        if (DateUtils.isDate(v)) return DateUtils.toDate(v);
        const d = new Date(v);
        return Number.isFinite(d.getTime()) ? d : null;
    }

    private inRange<T>(item: T,range: Range<T>,cmp: (a: T, b: T) => number): boolean {
        const [start, end] = range;
        if (start != null && cmp(item, start as T) < 0) return false;
        if (end != null && cmp(item, end as T) > 0) return false;
        return true;
    }
    

    getDefaultFilterFunction(type: ColumnFilterType | null): ColumnFilterPredicate {
        const predicates: Record<string, ColumnFilterPredicate> = {
            list: (item: any, value: any[]) => {
                const pred = listPredicate<any, any>(value, this.filterConfig() ?? {});
                return pred(item);
            },

            date: (item: any, value: Range<Date>) => {
                if (this.isEmptyFilterValue(value)) return true;

                const dateItem = this.toDateSafe(item);
                if (!dateItem) return false;

                const start = value?.[0] ?? null;
                const end = value?.[1] ?? null;
                if (!start && !end) return true;

                return this.inRange(dateItem, [start, end], (a, b) => a.getTime() - b.getTime());
            },

            numeric: (item: any, value: Range<number>) => {
                if (this.isEmptyFilterValue(value)) return true;

                const n = NumberUtils.toNumber(item);
                if (n === null) return false;

                const start = value?.[0] ?? null;
                const end = value?.[1] ?? null;
                if (start == null && end == null) return true;

                return this.inRange(n, [start, end], (a, b) => a - b);
            },

            boolean: (item: any, value: boolean) => {
                if (this.isEmptyFilterValue(value)) return true;
                return item === value;
            },

            text: (item: any, value: string) => {
                if (this.isEmptyFilterValue(value)) return true;

                const hay = this.toLowerStr(item);
                if (!hay) return false;

                const needle = value.trim().toLowerCase();
                return hay.includes(needle);
            },
        };

        return predicates[type ?? 'text'] ?? predicates['text'];
    }

}

type Range<T> = readonly [T | null | undefined, T | null | undefined];
type Key = string | number | boolean | Date | null | undefined;

export interface ListFilterConfig<TItem = any, TValue = any> {
  /** como extrair a chave do item da linha */
  itemKey?: (item: TItem) => Key;
  /** como extrair a chave do valor selecionado do Filtro */
  valueKey?: (v: TValue) => Key;

  /** alternativa: path tipo 'representative.name' */
  itemKeyPath?: string;
  valueKeyPath?: string;

  /** normalização: por padrão, string vira lower+trim */
  normalize?: (k: Key) => string | number | boolean | null;
}