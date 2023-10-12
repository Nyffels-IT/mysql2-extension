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
  return Reflect.getMetadata(nameMetaDatakey, target, propertyKey);
}

export function getType(target: any, propertyKey: string) {
  return Reflect.getMetadata(typeMetaDatakey, target, propertyKey);
}
