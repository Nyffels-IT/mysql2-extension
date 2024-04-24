import _ from 'lodash';
import { getTable } from '../decorators/class.decorator';
import { getName, getType } from '../decorators/property.decorator';
import { InsertValue, SelectQueryOptions, UpdateValue } from '../models';
import { parseBoolean, parseDate, parseNumber, parseString } from './parsers.logic';

/**
 * Generate a select query
 * @param target The target class with mysql decorations
 * @param properties The properties you wish to get from the select. Leave empty for all (wildcard *)
 * @param where Add a where string without "WHERE". You can use the where query builders for generations
 * @param options Add options to the select query like limits, orders, offsets
 * @returns A generated select query as a string
 */
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

/**
 * Generate an insert query for a single row
 * @param target The target class with mysql decorations
 * @param values The values for the insert
 * @returns A genrated insert query as a string
 */
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

/**
 * Generate an insert query for a multiple rows
 * @param target The target class with mysql decorations
 * @param values The values for the insert
 * @returns A genrated insert query as a string
 */
export function getBulkInsertQuery(target: any, values: InsertValue[][]) {
  if ((values ?? []).length <= 0) {
    console.error(`Generation for bulk insert query requested without values for table '${getTable(target)}'.`);
  }

  const properties = values[0].filter((value) => !!getName(target, value.property)).map((value) => getName(target, value.property));
  const insertValues = values.map((row) => {
    const rowValues: string[] = [];
    for (let value of row) {
      if (!!getName(target, value.property)) {
        rowValues.push(parseValue(target, value.property, value.value));
      }
    }
    return rowValues;
  });

  let query = `INSERT INTO ${getTable(target)} (${properties.join(',')}) VALUES ${insertValues.map((insertValue) => '(' + insertValue.join(',') + ')').join(',')}`;
  return query;
}

/**
 * Generate an update query
 * @param target The target class with mysql decorations
 * @param values The values you wish to update
 * @param where Add a where string without "WHERE". You can use the where query builders for generations
 * @returns A generated update query as a string
 */
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

/**
 * Generate an delete query
 * @param target The target class with mysql decorations
 * @param where Add a where string without "WHERE". You can use the where query builders for generations
 * @returns A generated delete query as a string
 */
export function getDeleteQuery(target: any, where: string = '') {
  let query = `DELETE FROM ${getTable(target)}`;
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

/**
 * Convert a query result to an object.
 * @param target The target class with mysql decorations
 * @param results The query results received from the mysql query
 * @returns A generated object from the target class value. 
 */
export function queryResultToObject<T = any>(target: any, results: any[]) {
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

  return (result as T[]);
}
