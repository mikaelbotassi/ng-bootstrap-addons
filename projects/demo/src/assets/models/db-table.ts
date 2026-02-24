/*
{
    "id": "servicos-emergenciais",
    "columns": [
        {
            "field": "dadosOcorencia.nmServico",
            "header": "Servico",
            "type": "text"
        },
    ],
    "filters": {}
}
*/

export class PreferenciasUsuarioResp {
    cdUsuario!: string;
    cdSistema!: string;
    dsPreferencia!: string;

    get preferencias(): PreferenciasUsuario {
        return JSON.parse(this.dsPreferencia) as PreferenciasUsuario;
    }

    constructor(data: Partial<PreferenciasUsuarioResp>) {
        Object.assign(this, data);
    }

}

export interface PreferenciasUsuario{
    tables: TablePreference[];
}

export interface TablePreference{
    id:string;
    columns: ColumnPreference[];
    filters: FilterPreference[];
}

export interface ColumnPreference{
    field: string;
    header: string;
    type: string;
}

export interface FilterPreference{}