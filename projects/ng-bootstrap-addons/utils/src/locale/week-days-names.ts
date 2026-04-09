abstract class IWeekDayName {

    /** Segunda-feira */
    static MONDAY: IWeekDayName;
    /** Terça-feira */
    static TUESDAY: IWeekDayName;
    /** Quarta-feira */
    static WEDNESDAY: IWeekDayName;
    /** Quinta-feira */
    static THURSDAY: IWeekDayName;
    /** Sexta-feira */
    static FRIDAY: IWeekDayName;
    /** Sábado */
    static SATURDAY: IWeekDayName;
    /** Domingo */
    static SUNDAY: IWeekDayName;

    full: string;
    short: string
    lang: 'pt' | 'en' = 'pt';

    protected constructor(full: string, short: string, lang: 'pt' | 'en' = 'pt') {
        this.full = full;
        this.short = short;
        this.lang = lang;
    }

    static get values():IWeekDayName[]{
        return [
            this.SUNDAY,
            this.MONDAY,
            this.TUESDAY,
            this.WEDNESDAY,
            this.THURSDAY,
            this.FRIDAY,
            this.SATURDAY,
        ]
    };

}

class WeekDayNamePT extends IWeekDayName {

    static override MONDAY = new WeekDayNamePT('Segunda-feira', 'Seg')
    static override TUESDAY = new WeekDayNamePT('Terça-feira', 'Ter')
    static override WEDNESDAY = new WeekDayNamePT('Quarta-feira', 'Qua')
    static override THURSDAY = new WeekDayNamePT('Quinta-feira', 'Qui')
    static override FRIDAY = new WeekDayNamePT('Sexta-feira', 'Sex')
    static override SATURDAY = new WeekDayNamePT('Sábado', 'Sáb')
    static override SUNDAY = new WeekDayNamePT('Domingo', 'Dom')

    constructor(full: string, short: string) {
        super(full, short, 'pt');
    }

}

class WeekDayNameEN extends IWeekDayName {

    static override MONDAY = new WeekDayNameEN('Monday', 'Mon')
    static override TUESDAY = new WeekDayNameEN('Tuesday', 'Tue')
    static override WEDNESDAY = new WeekDayNameEN('Wednesday', 'Wed')
    static override THURSDAY = new WeekDayNameEN('Thursday', 'Thu')
    static override FRIDAY = new WeekDayNameEN('Friday', 'Fri')
    static override SATURDAY = new WeekDayNameEN('Saturday', 'Sat')
    static override SUNDAY = new WeekDayNameEN('Sunday', 'Sun')
    
    constructor(full: string, short: string) {
        super(full, short, 'en');
    }

}

export abstract class WeekDayName{
    static PT = WeekDayNamePT;
    static EN = WeekDayNameEN;
}