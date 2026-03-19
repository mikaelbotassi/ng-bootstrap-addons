const formatterCache = new Map<number, Intl.NumberFormat>();

function getPtBrFormatter(decimalPlaces: number): Intl.NumberFormat {
  let formatter = formatterCache.get(decimalPlaces);

  if (!formatter) {
    formatter = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });

    formatterCache.set(decimalPlaces, formatter);
  }

  return formatter;
}

export function toPtBr(value: number, decimalPlaces = 2): string {
  if (!Number.isFinite(value)) {
    return String(value);
  }

  if (decimalPlaces === 0) {
    return value.toFixed(0);
  }

  return getPtBrFormatter(decimalPlaces).format(value);
}

export function toPtBrAutoPrecision(value: number): string {
  if (!Number.isFinite(value)) {
    return String(value);
  }

  const valueString = value.toString();

  if (valueString.includes('.')) {
    const decimalPart = valueString.split('.').pop() ?? '';
    const precision = decimalPart.length;

    if (precision === 1 && decimalPart === '0') {
      return toPtBr(value, 0);
    }

    return toPtBr(value, precision);
  }

  return toPtBr(value, 0);
}