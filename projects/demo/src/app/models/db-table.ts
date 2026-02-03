import { Column } from "project/table/src/components/column-multiselect/column-multiselect.component";

export interface DbUser{
    cdUsuario:string
    tables: DbTable[]
}

export interface DbTable{
    id: string;
    columns: Column[]
}