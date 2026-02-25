import { Injectable } from "@angular/core";
import { ArrayUtils, behaviorSignal } from "ng-bootstrap-addons/utils";
import { SortEvent } from "../public_api";

@Injectable()
export class TablePreferencesService {

    private _preferences = behaviorSignal<TablePreferences|null>(null);
    preferences = this._preferences.asReadonly();

    init(id:string){
        this._preferences.set(new TablePreferences(id));
    }

    isValid(newPref: TablePreferences|null) {
        if(newPref == null) return false;
        const pref = this._preferences();
        if(!pref) return false;
        return !TablePreferences.isEqual(pref, newPref);
    }

    setPreferences(newPref: TablePreferences|null, emitEvent = true) {
        if(newPref == null) return;
        const pref = this._preferences();
        if(!pref) return;
        if(TablePreferences.isEqual(pref, newPref)) return;
        this._preferences.set(newPref, {emitEvent});
    }

    setSort(sort: SortEvent | null) {
        const pref = this._preferences();
        if(pref == null) return;
        if(pref.sort?.field == sort?.field && pref.sort?.direction == sort?.direction) return;
        this.setPreferences({...this._preferences()!, sort});
    }

    setColumns(columns: string[]) {
        const pref = this._preferences();
        if(pref == null) return;
        if(ArrayUtils.containTheSameElements(pref.columns, columns)) return;
        this.setPreferences({...pref, columns});
    }

    setFilterValue(field: string, value: any) {
        const pref = this._preferences();
        if(!pref) return;
        if(pref.filters[field] == value) return;
        this.setPreferences({...this._preferences()!, filters: {...this._preferences()!.filters, [field]: value}});
    }

    removeFilterValue(field: string) {
        const pref = this._preferences();
        if (!pref) return;
        if (!pref.filters[field]) return;
        const { [field]: _, ...filters } = pref.filters;
        this.setPreferences({ ...pref, filters });
    }

}

export class TablePreferences{

    id:string;
    filters: Record<string, any>;
    sort: SortEvent | null;
    columns: string[];

    constructor(id:string){
        this.id = id;
        this.filters = {};
        this.sort = null;
        this.columns = [];
    }

    static keyOf(table: TablePreferences): string {
        return `${table.id}_${table.columns.sort().join(',')}${JSON.stringify(table.sort)}_${JSON.stringify(table.filters)}`;
    }

    static isEqual(a:TablePreferences, b:TablePreferences): boolean {
        return TablePreferences.keyOf(a) === TablePreferences.keyOf(b);
    }

}