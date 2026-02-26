import { computed, Directive, inject, untracked } from "@angular/core";
import { TableComponent } from "../table.component";
import { MultiselectOption } from "ng-bootstrap-addons/selects";

@Directive({
    selector:'nba-table[col-to-opt]',
    exportAs: 'colToOpt'
})
export class ColumnToOptionDirective{

    table = inject(TableComponent);
    fields = computed(() => this.table.columns()?.map((col)=>col.field) ?? this.table.columnHeaders().map((col)=>col.field()));

    colFieldsMap = computed(() => {
        this.table.value();
        return untracked(()=>{
            const fields = this.fields();
            if(!fields.length) return {};
            const record:Record<string,any[]> = {};
            fields.forEach((field)=>{
                record[field] = this._getAllValuesFromField(field);
            });
            return record;
        });
    });

    toOptions<TItem = unknown, TValue = TItem>(columnKey: string,mapping: OptionMapping<TItem, TValue> = {}): MultiselectOption<TValue>[] {
        const items = this.colFieldsMap()[columnKey] as TItem[] | undefined;
        if (!items?.length) return [];

        const label = mapping.label ?? ((x: any) => String(x));
        const value = mapping.value ?? ((x: any) => x as TValue);

        return items.map(item => new MultiselectOption<TValue>({label: label(item),value: value(item),}));
    }

    private _getAllValuesFromField(field: string) {
        const data = this.table.value() ?? [];
        const seen = new Set<any>();
        const out: any[] = [];

        for (let i = 0; i < data.length; i++) {
            const v = this.table.getFieldValue(data[i], field);

            if (v == null) continue;

            if (seen.has(v)) continue;

            seen.add(v);
            out.push(v);
        }

        return out;
    }

}

type Selector<T, R> = (item: T) => R;

export interface OptionMapping<TItem = unknown, TValue = any> {
  label?: Selector<TItem, string>;
  value?: Selector<TItem, TValue>;
}