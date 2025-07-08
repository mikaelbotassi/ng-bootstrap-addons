import { NumericPipe } from 'ng-bootstrap-addons/pipes';

describe('NumericPipe', () => {
  let pipe: NumericPipe;

  beforeEach(() => {
    pipe = new NumericPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the value unchanged if not a number', () => {
    expect(pipe.transform('abc')).toBe('abc');
    expect(pipe.transform(null)).toBe(null);
    expect(pipe.transform(undefined)).toBe(undefined);
    expect(pipe.transform({})).toEqual({});
  });

  it('should format the number without currency by default', () => {
    const result = pipe.transform(1234.567);
    expect(result).toBe('1.234,567');
  });

  it('should format the number with specified decimal places', () => {
    const value = 1234.567;
    expect(pipe.transform(value, false, 0)).toBe('1.235');
    expect(pipe.transform(value, false, 2)).toBe('1.234,57');
    expect(pipe.transform(value, false, 4)).toBe('1.234,5670');

  });

  it('should format the number as currency when currency is true', () => {
    const result = pipe.transform(1234.567, true);
    expect(result).toBe('R$ 1.234,57');
  });
});
