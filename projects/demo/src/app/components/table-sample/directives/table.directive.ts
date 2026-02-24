import { HttpClient } from "@angular/common/http";
import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  untracked,
} from "@angular/core";
import { Command2 } from "ng-bootstrap-addons/utils";
import { Column, FilterFunction } from "project/table/src/public_api";
import { TableComponent } from "project/table/src/table.component";
import { DbTable, DbUser } from "projects/demo/src/app/models/db-table";
import { Observable, defer, finalize, of } from "rxjs";

@Directive({
  selector: "nba-table[db-table]",
  standalone: true,
})
export default class TableDirective implements OnInit {
  private table = inject(TableComponent, { self: true });
  private hostEl = inject(ElementRef<HTMLElement>);
  private client = inject(HttpClient);

  private lastValue?:DbTable;

  id!: string;
  hydrated = false;

  currentValue = computed(() => {
    const columns = this.table.selectedColumns();
    const filters = this.table.filters();
    return { id: this.id, columns: (columns ?? []).filter(c => c.visible).map(c => c.field) || [], filters };
  });

  saveTableCommand = new Command2<void,Column[] | null | undefined,Record<string, FilterFunction>>((columns, filters) => this._saveTable(columns, filters));

  constructor() {
    effect(() => {
      const columns = this.table.selectedColumns();
      const filters = this.table.filters();
      if(!this.hydrated) return;
      const current = untracked(() => this.currentValue());
      if(!this.lastValue || DbTable.isEqual(this.lastValue, current)){
        this.lastValue = current;
        return;
      }
      this.lastValue = current;
      untracked(() => this.saveTableCommand.execute(columns, filters));
    });
  }
  

  ngOnInit(): void {
    this.id = this.hostEl.nativeElement.id;
    this.getTables()
    .pipe(finalize(() => this.hydrated = true))
    .subscribe((resp) => {
      for (const user of resp) {
        for (const table of user.tables) {
          if (table.id === this.id) {
              this.table.columns.update(curr => {
                if(!curr || curr.length === 0) return curr;
                return curr.map(col => {
                  const colPref = table.columns?.find(c => c === col.field);
                  return {...col, visible: !!colPref};
                });
              });
              this.table.tableService.columnFilterValues.set(table.filters ?? {});
          }
        }
      }
    });
  }

  getTables() : Observable<DbUser[]> {
    return this.client.get<DbUser[]>("data/db-table.json");
  }

  private _saveTable(columns: Column[] | null | undefined,filters: Record<string, FilterFunction>): Observable<void> {
    console.log('Saving table with columns: ', columns, 'and filters: ', filters);
    return defer(() => {

      // TODO: chamada real:
      // return this.client.post<void>('/api/table/preferences', { id: this.id, columns, filters });

      return of(void 0);
    });
  }
}