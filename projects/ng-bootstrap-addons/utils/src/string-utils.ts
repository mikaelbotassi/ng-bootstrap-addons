import { DateUtils } from "./date-utils";

export abstract class StringUtils{
    static toDate(str:string) {
        return DateUtils.toDate(str.toString());
    };

    static toNumber(str:string) {
        const normalized = str.toString().replace(/\./g, '').replace(',', '.');
        const parsed = parseFloat(normalized);
        return isNaN(parsed) ? 0 : parsed;
    }

    static convertToNoAccents(str:string) {
        return str.toString()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    };
}