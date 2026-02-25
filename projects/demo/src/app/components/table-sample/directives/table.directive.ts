import { HttpClient } from "@angular/common/http";
import {
  Directive,
  effect,
  inject,
  untracked,
} from "@angular/core";
import { Command1 } from "ng-bootstrap-addons/utils";
import { TablePreferences, TablePreferencesService } from "project/table/src/public_api";
import { Observable, defer, of } from "rxjs";

@Directive({selector: "nba-table[db-table]",})
export class TableDirective {

  private tablePreferences = inject(TablePreferencesService);
  private client = inject(HttpClient);

  skipNext = true;
  lastValue:TablePreferences | null = null;

  saveTableCommand = new Command1<void,TablePreferences>((dbTable) => this._saveTable(dbTable));

  loadTableEffect = effect(() => {
    const pref = this.tablePreferences.preferences();
    if(!pref) return;
    untracked(() => this._loadTable());
    this.loadTableEffect.destroy();
  });

  constructor() {
    effect(() => {
      const preferences = this.tablePreferences.preferences();
      if(!preferences) return;
      if(this.skipNext) {
        this.skipNext = false;
        return;
      }
      if(!this.lastValue){
        this.lastValue = preferences;
        return;
      }
      if(!this.tablePreferences.isValid(this.lastValue)) return;
      this.lastValue = preferences;
      untracked(() => this.saveTableCommand.execute(preferences!));
    });
  }

  private _loadTable() {
    return this.client.get<DbUser[]>("data/db-table.json").subscribe((resp) => {
      for (const user of resp) {
        for (const table of user.tables) {
          if (table.id === this.tablePreferences.preferences()!.id) {
            this.tablePreferences.setPreferences(table);
            this.skipNext = true;
            return;
          }
        }
      }
    });
  }

  private _saveTable(dbTable: TablePreferences): Observable<void> {
    console.log("🚀 ~ TableDirective ~ _saveTable ~ dbTable:", dbTable)
    return defer(() => {

      // TODO: chamada real:
      // return this.client.post<void>('/api/table/preferences', { id: this.id, columns, filters });

      return of(void 0);
    });
  }
}

export interface DbUser{
    cdUsuario:string
    tables: TablePreferences[]
}