const tableMetaDataKey = Symbol('table');

export function table(name: string) {
  return Reflect.metadata(tableMetaDataKey, name);
}

export function getTable(target: any) {
  return Reflect.getMetadata(tableMetaDataKey, target.constructor);
}
