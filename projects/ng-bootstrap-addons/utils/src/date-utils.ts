export abstract class DateUtils {
  static toDate(date: string): Date {
    let dateFormatted = date.length > 19 ? date.substring(0, 19) : date;
    dateFormatted = dateFormatted.replace(/-/g, '/').replace(/T/, ' ');
    return new Date(dateFormatted);
  }

  static addDays(date: Date, days: number): Date {
    const newDate = new Date(date);
    newDate.setUTCDate(newDate.getUTCDate() + days);
    return newDate;
  }

  static addDaysFromString(date: string, days: number): Date {
    return this.addDays(this.toDate(date), days);
  }

  static formatDate(date: Date, formatString: string): string {
    const padZero = (n: number) => (n < 10 ? '0' + n : n.toString());

    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());
    const milliseconds = padZero(date.getMilliseconds());

    const MM_PLACEHOLDER = '__MES__';
    let fmt = formatString.replace(/MM/g, MM_PLACEHOLDER).toUpperCase();

    return fmt
      .replace('YYYY', year.toString())
      .replace(MM_PLACEHOLDER, month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('MM', minutes)
      .replace('SS', seconds)
      .replace('S', milliseconds);
  }

  static formatDateString(date: string, format: string): string {
    return this.formatDate(this.toDate(date), format);
  }

  static getFormattedCurrentDate(format: string = 'YYYY-MM-DD'): string {
    return this.formatDate(new Date(), format);
  }

  static getMonthNameFromNumber(month: number, lang: string): string {
    const monthNamesPt = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    const monthNamesEn = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthNames = lang === 'pt' ? monthNamesPt : monthNamesEn;
    return monthNames[month];
  }

  static isDate(value: any): boolean {
    if (!value) return false;
    const dateObj = new Date(value);
    return !isNaN(dateObj.getTime()) && dateObj.toString() !== 'Invalid Date';
  }

  static fromBrazilianDate(brazilianDate: string): Date {
    if (!brazilianDate || typeof brazilianDate !== 'string') {
      throw new Error(
        'Invalid input: brazilianDate must be a non-empty string.'
      );
    }

    const [date, time = '00:00:00'] = brazilianDate.split(' ');
    const dateParts = date.split('/');

    if (dateParts.length !== 3) {
      throw new Error('Invalid date format: Expected format is DD/MM/YYYY.');
    }

    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const year = parseInt(dateParts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new Error('Invalid date components.');
    }

    const timeParts = time.split(':');
    const hours = parseInt(timeParts[0], 10) || 0;
    const minutes = parseInt(timeParts[1], 10) || 0;
    const seconds = parseInt(timeParts[2], 10) || 0;

    return new Date(year, month - 1, day, hours, minutes, seconds);
  }

  static getDayOfWeek(date: Date): { full: string; short: string } {
    const daysOfWeek = [
      { full: 'Domingo', short: 'Dom' },
      { full: 'Segunda-feira', short: 'Seg' },
      { full: 'Terça-feira', short: 'Ter' },
      { full: 'Quarta-feira', short: 'Qua' },
      { full: 'Quinta-feira', short: 'Qui' },
      { full: 'Sexta-feira', short: 'Sex' },
      { full: 'Sábado', short: 'Sáb' },
    ];
    return daysOfWeek[date.getDay()];
  }

  static dateDiff(
    dateA: Date,
    dateB: Date
  ): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } {
    const diffInMs = Math.abs(dateA.getTime() - dateB.getTime());
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    return {
      days: diffInDays,
      hours: diffInHours % 24,
      minutes: diffInMinutes % 60,
      seconds: diffInSeconds % 60,
    };
  }
}
