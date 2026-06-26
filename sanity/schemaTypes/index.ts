import { type SchemaTypeDefinition } from 'sanity';
import { post } from './post';
import { blockContent } from './blockContent';
import {
  localeString,
  localeText,
  localeSlug,
  localeImage,
  localeBlockContent,
} from './locale';

export const schemaTypes: SchemaTypeDefinition[] = [
  // document
  post,
  // building blocks
  blockContent,
  localeString,
  localeText,
  localeSlug,
  localeImage,
  localeBlockContent,
];
