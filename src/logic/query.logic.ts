import _ from 'lodash';
import { getTable } from '../decorators/class.decorator';
import { getName, getType } from '../decorators/property.decorator';
import { InsertValue, SelectQueryOptions, UpdateValue } from '../models';
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
          .filter((order) => !!getName(target, order.property))
          .map((order) => {
            const name = getName(target, order.property);
            return `${name} ${!_.isNil(order.property) ? order.direction : 'ASC'}`;
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

  values
    .filter((value) => !!getName(target, value.property))
    .forEach((value) => {
      propertyQueries.push(getName(target, value.property));
      valueQueries.push(parseValue(target, value.property, value.value));
    });

  if ((propertyQueries ?? []).length <= 0 || (valueQueries ?? []).length <= 0) {
    console.error(`Generation for insert query requested without values for table '${getTable(target)}'.`);
    return;
  }

  let query = `INSERT INTO ${getTable(target)} (${propertyQueries.join(', ')}) VALUES (${valueQueries.join(', ')})`;
  return query;
}

export function getUpdateQuery(target: any, values: UpdateValue[], where: string = '') {
  const updateString = values
    .map((value) => {
      const valueProperty = getName(target, value.property);
      const valueValue = parseValue(target, value.property, value.value);
      return `${valueProperty} = ${valueValue}`;
    })
    .join(', ');

  let query = `UPDATE ${getTable(target)} SET ${updateString}`;
  if ((where ?? '').length > 0) {
    query += ` WHERE ${where}`;
  }
  return query;
}

export function getInsertValuesFromTarget(target: any) {
  const values: InsertValue[] = [];
  Object.keys(target).forEach((key) => {
    values.push({
      property: key,
      value: target[key],
    });
  });
  return values;
}

export interface GetUpdateValuesFromTargetOptions {
  compareTarget?: any;
  skipKeys?: string[];
}

export function getUpdateValuesFromTarget(target: any, options: GetUpdateValuesFromTargetOptions) {
  const values: UpdateValue[] = [];
  let keys = Object.keys(target);
  if (!_.isNil(options) && (options.skipKeys ?? []).length > 0) {
    keys = keys.filter((k) => !(options.skipKeys ?? []).includes(k));
  }
  keys.forEach((key) => {
    const value: UpdateValue = {
      property: key,
      value: target[key],
    };

    if (!_.isNil(options) && !_.isNil(options.compareTarget)) {
      if (target[key] !== options.compareTarget[key]) {
        values.push(value);
      }
    } else {
      values.push(value);
    }
  });
  return values;
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

export function comparePropertiesArray(target: any, property: string, values: any[]) {
  return `${getName(target, property)} IN (${values.map((v) => parseValue(target, property, v)).join(',')})`;
}

export function queryResultToObject(target: any, results: any[]) {
  const properties = Object.getOwnPropertyNames(target);
  const result: any[] = [];

  (results ?? []).forEach((res) => {
    const resultObject = {} as any;
    properties.forEach((prop) => {
      const columnname = getName(target, prop);
      if (columnname) {
        resultObject[prop] = res[columnname];
      }
    });
    result.push(resultObject);
  });

  return result;
}
