import _ from 'lodash';
import { getTable } from '../decorators/class.decorator';
import { getName, getType } from '../decorators/property.decorator';
import { InsertValue, SelectQueryOptions } from '../models';
import { parseBoolean, parseDate, parseNumber, parseString } from './parsers.logic';

export function getSelectQuery(target: any, properties: string[] = [], where: string = '', options: SelectQueryOptions | null = null) {
  let props = '';
  if ((properties ?? []).length > 0) {
    props = properties.map((property) => getName(target, property)).join(', ');
  } else {
    props = '*';
  }

  let query = `SELECT ${props} FROM ${getTable(target)}`;

  if ((where ?? '').length > 0) {
    query += ` WHERE ${where}`;
  }

  if (!_.isNil(options)) {
    if ((options.order ?? []).length > 0) {
      query +=
        ' ORDER BY ' +
        (options.order ?? [])
          .filter((order) => {
            const name = getName(target, order.property);
            if (!name) {
              console.error(`Property '${name}' not found and will be filtered out of the query`);
            }
            return !!name;
          })
          .map((order) => {
            const name = getName(target, order.property);
            return `${name} ${!_.isNil(order.property) ? order.property : 'ASC'}`;
          })
          .join(', ');
    }

    if (!_.isNil(options.limit)) {
      query += ` LIMIT ${options.limit}`;
    }

    if (!_.isNil(options.offset)) {
      query += ` OFFSET ${options.offset}`;
    }
  }

  return query;
}

export function getInsertQuery(target: any, values: InsertValue[]) {
  let propertyQueries: string[] = [];
  let valueQueries: string[] = [];
  values.forEach((value) => {
    const propertyName = getName(target, value.property);
    if (!propertyName) {
      console.error(`Property '${name}' not found and will be filtered out of the query`);
    } else {
      propertyQueries.push(propertyName);
      valueQueries.push(parseValue(target, value.property, value.value));
    }
  });

  if ((propertyQueries ?? []).length <= 0 || (valueQueries ?? []).length <= 0) {
    console.error(`Generation string with requested without values for table '${getTable(target)}'.`);
    return;
  }

  let query = `INSERT INTO ${getTable(target)} (${propertyQueries.join(', ')}) VALUES (${valueQueries.join(', ')})`;
  return query;
}

export function parseValue(target: any, property: string, value: any) {
  switch (getType(target, property)) {
    case 'number':
      return parseNumber(value);
    case 'boolean':
      return parseBoolean(value);
    case 'date':
      return parseDate(value, false);
    case 'datetime':
      return parseDate(value, true);
    default:
      return parseString(value);
  }
}

export function compareProperties(target: any, property: string, value: any, symbol = '=') {
  return `${getName(target, property)} ${symbol} ${parseValue(target, property, value)}`;
}
