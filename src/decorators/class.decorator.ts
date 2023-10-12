const tableMetaDataKey = Symbol('table');

export function table(name: string) {
  return Reflect.metadata(tableMetaDataKey, name);
}

export function getTable(target: any) {
  try {
    return Reflect.getMetadata(tableMetaDataKey, target.constructor);
  } catch (ex) {
    console.error(`Table not known for type '${target.constructor.name}'`);
    return null;
  }
}
