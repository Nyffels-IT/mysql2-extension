import _ from 'lodash';

export function parseString(value: string): string {
  return value != null && value.toString().trim().length > 0 ? `'${value.toString().replace(/'/g, "''")}'` : 'NULL';
}

export function parseNumber(value: number): string {
  return value != null ? '' + value : 'NULL';
}

export function parseBoolean(value: boolean, canBeNull = false): string {
  return _.isNil(value) ? (canBeNull ? 'NULL' : '0') : value ? '1' : '0';
}

export function parseDate(date: Date, time = false): string {
  if (date == null) return 'NULL';
  return time ? `'${new Date(date).toISOString().slice(0, 19).replace('T', ' ')}'` : `'${new Date(date).toISOString().slice(0, 10)}'`;
}
