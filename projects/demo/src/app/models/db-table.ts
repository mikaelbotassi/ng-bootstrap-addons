
export interface DbUser{
    cdUsuario:string
    tables: DbTable[]
}

export class DbTable{

    filters!: Record<string, any>;
    id!: string;
    columns!: string[];

    static keyOf(table: DbTable): string {
        return `${table.id}_${table.columns.sort().join(',')}_${JSON.stringify(table.filters)}`;
    }

    static isEqual(a:DbTable, b:DbTable): boolean {
        return DbTable.keyOf(a) === DbTable.keyOf(b);
    }

}