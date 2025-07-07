export class Formatter{

    locale: string = 'pt-BR';

    constructor(preferences?:{locale?: string}){

        if(!preferences) return;
        
        if(preferences.locale) this.locale = preferences.locale;
    }

    formatDateStringAndRemoveTime(date: string): string {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' } as Intl.DateTimeFormatOptions;
        return new Date(date).toLocaleDateString(this.locale, options);
    }
    
    formatDecimalNumber = (value: number, decimalPlaces?:number): string => {
        const options = { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces } as Intl.NumberFormatOptions;
        return new Intl.NumberFormat(this.locale, options).format(value);
    }
    
}