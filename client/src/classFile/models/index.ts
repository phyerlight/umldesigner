import { ClassEntity } from './ClassEntity';
import { RelationEntity } from "./RelationEntity";

export * from './ClassEntity';
export * from './ClassFile';
export * from "./RelationEntity";
export * from "./RelationType";
export * from "./ClassFileEntityType";

export const CLASS_FILE_TYPE = 'CLASS';
export type CLASS_FILE_TYPE= 'CLASS';

export type ClassFileEntities = ClassEntity | RelationEntity;