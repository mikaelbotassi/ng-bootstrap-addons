import { MonthName, WeekDayName } from "./locale";

export abstract class DateUtils {

  static toDate (date: string): Date {
    let dateFormated = date.length > 19 ? date.substring(0, 19) : date;
    // normaliza "YYYY-MM-DDTHH:mm:ss" ou similares
    dateFormated = dateFormated.replace(/-/g, '/').replace(/T/, ' ');
    return new Date(dateFormated);
  };

  static addDaysFromString (date: string, days: number): Date {
    const newDate = DateUtils.toDate(date);
    (newDate as any).addDays(days);
    return newDate;
  };

  static formatDateString (date: string, format: string): string {
    return (DateUtils.toDate(date) as any).format(format);
  };

  static getFormattedCurrentDate (format: string = 'YYYY-MM-DD'): string {
    return DateUtils.format(new Date(), format);
  };

  static getMonthNameFromNumber (month: number, lang: 'pt' | 'en' = 'pt'): string {
    const idx = month >= 1 && month <= 12 ? month - 1 : month;
    const list = lang === 'pt' ? MonthName.PT.values : MonthName.EN.values;
    return list[idx].full;
  };

  static isDate (value: any): boolean {
    if (value instanceof Date) return !isNaN(value.getTime());
    if (typeof value !== 'string') return false;
    return /^(\d{2,4}[\/-]\d{2}[\/-]\d{2,4}([\/T ]\d{2}:\d{2}(:\d{2})?)?)$/.test(value.trim());
  };

  static addDays(date:Date, days: number): void {
    date.setUTCDate(date.getUTCDate() + days);
  };

  static addHours(date:Date, hours: number): void {
    date.setUTCHours(date.getUTCHours() + hours);
  };

  static getDayOfWeek(date:Date, lang: 'pt' | 'en' = 'pt'): {
    full: string;
    short: string;
  } {
    return lang === 'pt' ? WeekDayName.PT.values[date.getDay()] : WeekDayName.EN.values[date.getDay()];
  };

  static dateDiff(date:Date, otherDate: Date) {
    const diffInMs = Math.abs(otherDate.getTime() - date.getTime());
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
  };

  static format(date:Date, formatString: string, lang: 'pt' | 'en' = 'pt') : string {
    const padZero = (number: number) =>
      number < 10 ? '0' + number : number.toString();

    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());
    const milliseconds = padZero(date.getMilliseconds());

    // Nomes dos dias da semana
    const dayNames =
      lang === 'pt' ? WeekDayName.PT.values : WeekDayName.EN.values;

    // Nomes dos meses
    const monthNames =
      lang === 'pt' ? MonthName.PT.values : MonthName.EN.values;

    const dayOfWeek = date.getDay();
    const monthIndex = date.getMonth();

    // Placeholders únicos para evitar conflitos
    const PLACEHOLDERS = {
      SSS: '__MILISEGUNDOS__',
      DDDD: '__DIA_COMPLETO__',
      DDD: '__DIA_ABREV__',
      MMMM: '__MES_COMPLETO__',
      MMM: '__MES_ABREV__',
      MM: '__MES_NUMERO__',
    };

    let fmt = formatString
      .replace(/SSS/gi, PLACEHOLDERS.SSS)
      .replace(/DDDD/gi, PLACEHOLDERS.DDDD)
      .replace(/DDD/gi, PLACEHOLDERS.DDD)
      .replace(/MMMM/g, PLACEHOLDERS.MMMM)
      .replace(/MMM/g, PLACEHOLDERS.MMM)
      .replace(/MM/g, PLACEHOLDERS.MM)

    return fmt
      .replace(/YYYY/gi, year.toString())
      .replace(PLACEHOLDERS.DDDD, dayNames[dayOfWeek].full)
      .replace(PLACEHOLDERS.DDD, dayNames[dayOfWeek].short)
      .replace(PLACEHOLDERS.MMMM, monthNames[monthIndex].full)
      .replace(PLACEHOLDERS.MMM, monthNames[monthIndex].short)
      .replace(PLACEHOLDERS.MM, month)
      .replace(/DD/gi, day)
      .replace(/HH/gi, hours)
      .replace(/mm/g, minutes)
      .replace(/SS/gi, seconds)
      .replace(PLACEHOLDERS.SSS, milliseconds);
  };

  static toJson(date:Date, includeTime:boolean = false): string {
    return DateUtils.format(date, `YYYY-MM-DD${includeTime ? 'THH:mm:ss' : ''}`);
  };
}
