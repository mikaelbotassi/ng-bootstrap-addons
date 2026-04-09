abstract class IMonthName{

    /** Janeiro */
    static JANUARY: IMonthName;
    /** Fevereiro */
    static FEBRUARY: IMonthName;
    /** Março */
    static MARCH: IMonthName;
    /** Abril */
    static APRIL: IMonthName;
    /** Maio */
    static MAY: IMonthName;
    /** Junho */
    static JUNE: IMonthName;
    /** Julho */
    static JULY: IMonthName;
    /** Agosto */
    static AUGUST: IMonthName;
    /** Setembro */
    static SEPTEMBER: IMonthName;
    /** Outubro */
    static OCTOBER: IMonthName;
    /** Novembro */
    static NOVEMBER: IMonthName;
    /** Dezembro */
    static DECEMBER: IMonthName;

    full: string;
    short: string;
    lang: 'pt' | 'en' = 'pt';

    protected constructor(full: string, short: string, lang: 'pt' | 'en' = 'pt') {
        this.full = full;
        this.short = short;
        this.lang = lang;
    }

    static get values():IMonthName[]{
        return [
            this.JANUARY,
            this.FEBRUARY,
            this.MARCH,
            this.APRIL,
            this.MAY,
            this.JUNE,
            this.JULY,
            this.AUGUST,
            this.SEPTEMBER,
            this.OCTOBER,
            this.NOVEMBER,
            this.DECEMBER,
        ]
    };

}

class MonthNamePT extends IMonthName {

    static override JANUARY = new MonthNamePT('Janeiro', 'Jan');
    static override FEBRUARY = new MonthNamePT('Fevereiro', 'Fev');
    static override MARCH = new MonthNamePT('Março', 'Mar');
    static override APRIL = new MonthNamePT('Abril', 'Abr');
    static override MAY = new MonthNamePT('Maio', 'Mai');
    static override JUNE = new MonthNamePT('Junho', 'Jun');
    static override JULY = new MonthNamePT('Julho', 'Jul');
    static override AUGUST = new MonthNamePT('Agosto', 'Ago');
    static override SEPTEMBER = new MonthNamePT('Setembro', 'Set');
    static override OCTOBER = new MonthNamePT('Outubro', 'Out');
    static override NOVEMBER = new MonthNamePT('Novembro', 'Nov');
    static override DECEMBER = new MonthNamePT('Dezembro', 'Dez');

    constructor(full: string, short: string) {
        super(full, short, 'pt');
    }

}

class MonthNameEN extends IMonthName {

    static override JANUARY = new MonthNameEN('January', 'Jan');
    static override FEBRUARY = new MonthNameEN('February', 'Feb');
    static override MARCH = new MonthNameEN('March', 'Mar');
    static override APRIL = new MonthNameEN('April', 'Apr');
    static override MAY = new MonthNameEN('May', 'May');
    static override JUNE = new MonthNameEN('June', 'Jun');
    static override JULY = new MonthNameEN('July', 'Jul');
    static override AUGUST = new MonthNameEN('August', 'Aug');
    static override SEPTEMBER = new MonthNameEN('September', 'Sep');
    static override OCTOBER = new MonthNameEN('October', 'Oct');
    static override NOVEMBER = new MonthNameEN('November', 'Nov');
    static override DECEMBER = new MonthNameEN('December', 'Dec');

    constructor(full: string, short: string) {
        super(full, short, 'en');
    }

}

export class MonthName{
    static PT = MonthNamePT;
    static EN = MonthNameEN;
}