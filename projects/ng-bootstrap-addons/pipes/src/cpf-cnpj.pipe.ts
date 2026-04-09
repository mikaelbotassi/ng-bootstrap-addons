import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'cpfCnpj',
    standalone: true,
})
export class CpfCnpjPipe implements PipeTransform {
    transform(value: string | number): string {
      if (!value) return '';
      let rawValue = value.toString().replace(/\D/g, '');
  
      if (rawValue.length < 11) {
        rawValue = rawValue.padStart(11, '0'); // Preencher para CPF
      } else if (rawValue.length > 11 && rawValue.length < 14) {
        rawValue = rawValue.padStart(14, '0'); // Preencher para CNPJ
      }
  
      if (rawValue.length === 11) {
        return rawValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else if (rawValue.length === 14) {
        return rawValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      }
  
      return value.toString();
    }
}