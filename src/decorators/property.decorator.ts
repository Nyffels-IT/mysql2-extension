import 'reflect-metadata';

const nameMetaDatakey = Symbol('name');
const typeMetaDatakey = Symbol('type');

export function name(name: string) {
  return Reflect.metadata(nameMetaDatakey, name);
}

export function type(type: string) {
  return Reflect.metadata(typeMetaDatakey, type);
}

export function getName(target: any, propertyKey: string) {
  try {
    return Reflect.getMetadata(nameMetaDatakey, target, propertyKey);
  } catch (ex) {
    console.error(`Property '${name}' not found and will return null or be filtered out of the query`);
    return null;
  }
}

export function getType(target: any, propertyKey: string) {
  try {
    return Reflect.getMetadata(typeMetaDatakey, target, propertyKey);
  } catch (ex) {
    return 'string';
  }
}
