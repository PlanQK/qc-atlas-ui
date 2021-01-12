/* tslint:disable */
import { LangString } from './lang-string';
import { Links } from './links';
import { Location } from './location';
import { Other } from './other';
import { QualifiedName } from './qualified-name';
import { Type } from './type';
import { Value } from './value';
export type EntityModelProvEntityDto = { 'id'?: QualifiedName, 'label'?: Array<LangString>, 'location'?: Array<Location>, 'type'?: Array<Type>, 'value'?: Value, 'others'?: Array<Other>, '_links'?: Links };
