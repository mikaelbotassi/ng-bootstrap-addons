import { HttpClient } from "@angular/common/http";
import {
  Directive,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  untracked,
} from "@angular/core";
import { Command2 } from "ng-bootstrap-addons/utils";
import { Column } from "project/table/src/components/column-multiselect/column-multiselect.component";
import { FilterFunction } from "project/table/src/public_api";
import { TableComponent } from "project/table/src/table.component";
import { DbUser } from "projects/demo/src/app/models/db-table";
import { Observable, defer, of } from "rxjs";

@Directive({
  selector: "nba-table[db-table]",
  standalone: true,
})
export default class TableDirective implements OnInit {
  private table = inject(TableComponent, { self: true });
  private hostEl = inject(ElementRef<HTMLElement>);
  private client = inject(HttpClient);

  private skipNextSave = true;

  id!: string;

  saveTableCommand = new Command2<void,Column[] | null | undefined,Record<string, FilterFunction>>((columns, filters) => this._saveTable(columns, filters));

  constructor() {
    effect(() => {
      const columns = this.table.selectedColumns();
      const filters = this.table.filters();

      if (this.skipNextSave) {
        this.skipNextSave = false;
        return;
      }

      untracked(() => this.saveTableCommand.execute(columns, filters));
    });
  }

  ngOnInit(): void {
    this.id = this.hostEl.nativeElement.id;
    this.getTables();
  }

  getTables() {
    this.client.get<DbUser[]>("data/db-table.json").subscribe((resp) => {

        for (const user of resp) {
            for (const table of user.tables) {
                if (table.id === this.id) {
                    // nova referência para garantir reatividade consistente
                    this.table.columns.set([...(table.columns ?? [])]);
                    // se você também hidrata filtros, aplique aqui dentro (untracked)
                    // this.table.filters.set(table.filters ?? {});
                }
            }
        }

        this.skipNextSave = true;

    });
  }

  private _saveTable(columns: Column[] | null | undefined,filters: Record<string, FilterFunction>): Observable<void> {
    return defer(() => {
      console.log("Salvar preferências", { id: this.id, columns, filters });

      // TODO: chamada real:
      // return this.client.post<void>('/api/table/preferences', { id: this.id, columns, filters });

      return of(void 0);
    });
  }
}