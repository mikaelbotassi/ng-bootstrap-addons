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
    
}