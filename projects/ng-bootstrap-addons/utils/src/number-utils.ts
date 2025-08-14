export class NumberUtils {
  static toNumber = (value: string): number => {
    if (typeof value !== 'string') {
      throw new Error('Invalid input: value must be a string.');
    }

    let s = value.trim();

    // Trata negativo entre parênteses: (123,45) => -123,45
    const neg = /^\(.*\)$/.test(s);
    if (neg) s = s.slice(1, -1);

    // Remove tudo que não é dígito, ponto, vírgula ou sinal
    s = s.replace(/[^\d.,+-]/g, '');

    // Normaliza sinal: mantém só o primeiro '-' se existir
    s = s.replace(/(?!^)-/g, ''); // remove hífens extras

    const hasDot = s.includes('.');
    const hasComma = s.includes(',');

    const removeAll = (str: string, ch: ',' | '.') =>
      str.replace(new RegExp('\\' + ch, 'g'), '');

    const replaceLast = (str: string, ch: ',' | '.', repl: string) => {
      const i = str.lastIndexOf(ch);
      return i === -1 ? str : str.slice(0, i) + repl + str.slice(i + 1);
    };

    // Regra geral:
    // - Se tem ponto e vírgula: o ÚLTIMO separador é o decimal; o outro é milhares.
    // - Se tem só um tipo:
    //     * Se aparece >1 vez e os grupos são de 3 -> milhares.
    //     * Senão, o último é decimal.
    if (hasDot && hasComma) {
      const lastDot = s.lastIndexOf('.');
      const lastComma = s.lastIndexOf(',');
      if (lastComma > lastDot) {
        // decimal = vírgula, milhares = ponto
        s = removeAll(s, '.');
        s = replaceLast(s, ',', '.');
      } else {
        // decimal = ponto, milhares = vírgula
        s = removeAll(s, ',');
        // ponto já é decimal
      }
    } else if (hasComma) {
      const parts = s.split(',');
      if (parts.length > 2) {
        // Várias vírgulas: trate a última como decimal, as anteriores como milhares
        s = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
      } else {
        // Uma vírgula só: decide se é milhares (grupo de 3) ou decimal
        const right = parts[1] ?? '';
        if (
          right.length === 3 &&
          /^\d+$/.test(right) &&
          /^\d+$/.test(parts[0])
        ) {
          // padrão de milhares (ex.: 1,000)
          s = parts.join('');
        } else {
          s = parts[0] + '.' + right;
        }
      }
    } else if (hasDot) {
      const parts = s.split('.');
      if (parts.length > 2) {
        // Vários pontos: se todos grupos internos são 3 dígitos, trate como milhares
        const mids = parts.slice(1, -1);
        const all3 = mids.length > 0 && mids.every((g) => g.length === 3);
        if (
          all3 &&
          /^\d+$/.test(parts[0]) &&
          /^\d+$/.test(parts[parts.length - 1])
        ) {
          s = parts.join(''); // só milhares, sem decimais
        } else {
          // último ponto como decimal, anteriores como milhares
          s = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1];
        }
      } else {
        // Um ponto só: decide se é milhares (grupo de 3) ou decimal
        const right = parts[1] ?? '';
        if (
          right.length === 3 &&
          /^\d+$/.test(right) &&
          /^\d+$/.test(parts[0])
        ) {
          s = parts.join('');
        } else {
          // já está com ponto decimal
          s = parts.join('.');
        }
      }
    }

    // Aplica sinal negativo se necessário
    if (neg) s = '-' + s;

    const n = Number(s);
    if (!Number.isFinite(n)) {
      throw new Error('Invalid input: value cannot be converted to a number.');
    }
    return n;
  };
}
